from django.contrib.auth import get_user_model
from django.test import TestCase, override_settings
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import AccessToken

from domain.foro.models import Publicacion
from public_api.session import COOKIE


class SesionTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.user = get_user_model().objects.create_user("acuarista", password="Prueba-local-C3!")

    def setUp(self):
        self.browser = APIClient(enforce_csrf_checks=True, HTTP_HOST="localhost:5173")
        self.auth = "/api/v1/auth/"
        self.publicaciones = "/api/v1/publicaciones"
        self.credentials = {"username": self.user.username, "password": "Prueba-local-C3!"}

    def csrf(self):
        return self.browser.get(self.auth + "csrf").json()["csrf"]

    def session_post(self, route, data=None, **headers):
        return self.browser.post(self.auth + route, data or {}, format="json",
                                 HTTP_X_CSRFTOKEN=self.csrf(), **headers)

    @override_settings(CSRF_COOKIE_SECURE=True)
    def test_hu1_login_publicacion_recarga_y_cierre(self):
        login = self.session_post("login", self.credentials)
        self.assertEqual(login.status_code, 200)
        self.assertNotIn("refresh", login.json())
        self.assertTrue(login.cookies[COOKIE]["httponly"])
        self.assertTrue(login.cookies[COOKIE]["secure"])
        self.assertEqual(login.cookies[COOKIE]["samesite"], "Lax")
        old_refresh = self.browser.cookies[COOKIE].value
        published = self.browser.post(
            self.publicaciones, {"contenido": "Publicación C3"}, format="json",
            HTTP_AUTHORIZATION=f"Bearer {login.json()['access']}",
        )
        self.assertEqual(published.status_code, 201)
        self.assertEqual(Publicacion.objects.get(pk=published.json()["id"]).autor_id, self.user.pk)

        self.assertEqual(self.browser.get(self.publicaciones).status_code, 401)
        restored = self.session_post("refresh")
        self.assertEqual(restored.status_code, 200)
        new_refresh = self.browser.cookies[COOKIE].value
        self.assertNotEqual(old_refresh, new_refresh)
        visible = self.browser.get(self.publicaciones, HTTP_AUTHORIZATION=f"Bearer {restored.json()['access']}")
        self.assertEqual(visible.json()["resultados"][0]["contenido"], "Publicación C3")

        self.browser.cookies[COOKIE] = old_refresh
        self.assertEqual(self.session_post("refresh").status_code, 401)
        self.browser.cookies[COOKIE] = new_refresh
        self.assertEqual(self.session_post("logout").status_code, 204)
        self.assertEqual(self.browser.cookies[COOKIE].value, "")
        self.browser.cookies[COOKIE] = new_refresh
        self.assertEqual(self.session_post("refresh").status_code, 401)

    def test_credenciales_csrf_origen_y_expiracion(self):
        for route in ("login", "refresh", "logout"):
            self.assertEqual(self.browser.post(self.auth + route, {}, format="json").status_code, 403)
        self.assertEqual(self.session_post("login", self.credentials, HTTP_ORIGIN="https://otro.example").status_code, 403)
        self.assertEqual(self.session_post("login", {**self.credentials, "password": "incorrecta"}).status_code, 401)
        self.assertEqual(self.session_post("refresh").status_code, 401)
        expired = AccessToken.for_user(self.user)
        expired["exp"] = 1
        self.assertEqual(self.browser.get(self.publicaciones, HTTP_AUTHORIZATION=f"Bearer {expired}").status_code, 401)
