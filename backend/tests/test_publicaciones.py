import base64
import json

from django.contrib.auth import get_user_model
from django.db import IntegrityError, transaction
from django.test import TestCase, override_settings
from rest_framework.test import APIClient

from aggregation import foro as casos
from domain.errors import DatosInvalidos
from domain.foro.models import Publicacion
from domain.foro.services import crear_publicacion


@override_settings(DEBUG=True)
class PublicacionesTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.password = "ClaveLocalParaPruebas-HU1!"
        cls.autor = get_user_model().objects.create_user("autor", password=cls.password)
        cls.otro = get_user_model().objects.create_user("otro", password=cls.password)

    def setUp(self):
        self.client = APIClient(HTTP_HOST="localhost")
        credenciales = base64.b64encode(f"autor:{self.password}".encode()).decode()
        self.client.credentials(HTTP_AUTHORIZATION=f"Basic {credenciales}")

    def test_hu1_e1_crea_persiste_y_muestra_en_foro(self):
        respuesta = self.client.post(
            "/api/v1/publicaciones", {"contenido": "¿Cómo cuidan sus acuarios?"}, format="json"
        )
        self.assertEqual(respuesta.status_code, 201)
        guardada = Publicacion.objects.get(pk=respuesta.data["id"])
        self.assertEqual(guardada.contenido, "¿Cómo cuidan sus acuarios?")
        self.assertEqual(guardada.autor_id, self.autor.pk)
        self.assertEqual(respuesta.data["autor"], {"id": self.autor.pk, "nombre": "autor"})
        self.assertEqual(self.client.get(respuesta["Location"]).status_code, 200)
        listado = self.client.get("/api/v1/publicaciones")
        self.assertEqual(listado.data["total"], 1)
        self.assertEqual(listado.data["resultados"][0]["id"], guardada.pk)

    def test_hu1_e2_contenido_vacio_no_escribe(self):
        for contenido in ["", " ", "\n\t", "\u00a0"]:
            with self.subTest(contenido=repr(contenido)):
                respuesta = self.client.post(
                    "/api/v1/publicaciones", {"contenido": contenido}, format="json"
                )
                self.assertEqual(respuesta.status_code, 400)
                self.assertIn("contenido", respuesta.data["error"]["detalles"])
        self.assertEqual(Publicacion.objects.count(), 0)

    def test_entrada_ausente_o_tipo_incorrecto_no_escribe(self):
        for entrada in [{}, {"contenido": None}, {"contenido": 25}, {"contenido": []}, []]:
            with self.subTest(entrada=entrada):
                respuesta = self.client.post("/api/v1/publicaciones", entrada, format="json")
                self.assertEqual(respuesta.status_code, 400)
        self.assertFalse(Publicacion.objects.exists())

    def test_no_admite_suplantar_autor_en_body(self):
        respuesta = self.client.post(
            "/api/v1/publicaciones", {"contenido": "Texto", "autor_id": self.otro.pk}, format="json"
        )
        self.assertEqual(respuesta.status_code, 400)
        self.assertFalse(Publicacion.objects.exists())

    def test_texto_no_almacenable_no_produce_error_de_servidor(self):
        for contenido in ["Texto\x00", "Texto\ud800"]:
            with self.subTest(contenido=repr(contenido)):
                respuesta = self.client.post(
                    "/api/v1/publicaciones",
                    json.dumps({"contenido": contenido}, ensure_ascii=True),
                    content_type="application/json",
                )
                self.assertEqual(respuesta.status_code, 400)
        self.assertFalse(Publicacion.objects.exists())

    def test_json_malformado_y_tipo_no_admitido(self):
        respuesta = self.client.post(
            "/api/v1/publicaciones", '{"contenido":', content_type="application/json"
        )
        self.assertEqual(respuesta.status_code, 400)
        respuesta = self.client.post(
            "/api/v1/publicaciones", "contenido=Texto", content_type="text/plain"
        )
        self.assertEqual(respuesta.status_code, 415)
        self.assertFalse(Publicacion.objects.exists())

    def test_sin_credenciales_o_clave_erronea_no_escribe(self):
        self.client.credentials()
        self.assertEqual(
            self.client.post("/api/v1/publicaciones", {"contenido": "Texto"}, format="json").status_code,
            401,
        )
        self.client.credentials(HTTP_AUTHORIZATION="Basic " + base64.b64encode(b"autor:incorrecta").decode())
        self.assertEqual(
            self.client.post("/api/v1/publicaciones", {"contenido": "Texto"}, format="json").status_code,
            401,
        )
        self.assertFalse(Publicacion.objects.exists())

    def test_cuenta_inactiva_no_puede_publicar(self):
        self.autor.is_active = False
        self.autor.save(update_fields=["is_active"])
        respuesta = self.client.post("/api/v1/publicaciones", {"contenido": "Texto"}, format="json")
        self.assertEqual(respuesta.status_code, 401)
        self.assertFalse(Publicacion.objects.exists())

    def test_basica_local_no_funciona_fuera_de_loopback(self):
        respuesta = self.client.post(
            "/api/v1/publicaciones", {"contenido": "Texto"}, format="json", REMOTE_ADDR="192.0.2.5"
        )
        self.assertEqual(respuesta.status_code, 401)
        self.assertFalse(Publicacion.objects.exists())

    @override_settings(DEBUG=False)
    def test_basica_de_pruebas_desactivada_fuera_de_desarrollo(self):
        respuesta = self.client.post("/api/v1/publicaciones", {"contenido": "Texto"}, format="json")
        self.assertEqual(respuesta.status_code, 401)
        self.assertFalse(Publicacion.objects.exists())

    def test_detalle_inexistente_y_metodo_no_permitido(self):
        self.assertEqual(self.client.get("/api/v1/publicaciones/999999").status_code, 404)
        respuesta = self.client.delete("/api/v1/publicaciones")
        self.assertEqual(respuesta.status_code, 405)
        self.assertIn("GET", respuesta["Allow"])

    def test_listado_paginado_orden_estable_y_autores_correctos(self):
        primera = crear_publicacion(self.autor.pk, "Primera")
        segunda = crear_publicacion(self.otro.pk, "Segunda")
        respuesta = self.client.get("/api/v1/publicaciones?limite=1&desplazamiento=0")
        self.assertEqual(respuesta.status_code, 200)
        self.assertEqual(respuesta.data["total"], 2)
        self.assertEqual(respuesta.data["resultados"][0]["id"], segunda["id"])
        self.assertEqual(respuesta.data["resultados"][0]["autor"]["nombre"], "otro")
        respuesta = self.client.get("/api/v1/publicaciones?limite=1&desplazamiento=1")
        self.assertEqual(respuesta.data["resultados"][0]["id"], primera["id"])

    def test_parametros_invalidos_no_se_ignoran(self):
        for parametros in ["limite=0", "limite=101", "desplazamiento=-1", "limite=x", "tema=pez"]:
            with self.subTest(parametros=parametros):
                self.assertEqual(self.client.get(f"/api/v1/publicaciones?{parametros}").status_code, 400)

    def test_dominio_rechaza_vacio_sin_pasar_por_http(self):
        with self.assertRaises(DatosInvalidos):
            crear_publicacion(self.autor.pk, "  ")
        self.assertFalse(Publicacion.objects.exists())

    def test_base_impide_insertar_contenido_vacio_directamente(self):
        with self.assertRaises(IntegrityError), transaction.atomic():
            Publicacion.objects.create(autor=self.autor, contenido="   ")
        self.assertFalse(Publicacion.objects.exists())

    def test_agregacion_combina_publicacion_y_autor_sin_exponer_clave(self):
        resultado = casos.publicar(self.autor.pk, " Texto válido ")
        self.assertEqual(resultado["contenido"], "Texto válido")
        self.assertEqual(set(resultado["autor"]), {"id", "nombre"})
        self.assertNotIn("autor_id", resultado)
