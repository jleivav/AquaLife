import base64
from unittest.mock import patch
from concurrent.futures import ThreadPoolExecutor
from django.contrib.auth import get_user_model
from django.db import close_old_connections
from django.test import TestCase, TransactionTestCase, override_settings
from rest_framework.test import APIClient
from domain.peces.models import Especie, Pez
from domain.ranking.models import Categoria, Pecera, Inscripcion, Voto
from domain.avisos.models import Notificacion
from domain.ranking import services as ranking
from domain.foro.models import Publicacion, Comentario
from domain.foro.comentarios import crear_comentario
from domain.errors import Conflicto



@override_settings(DEBUG=True)
class AvisosTests(TestCase):

    @classmethod
    def setUpTestData(cls):
            cls.a = get_user_model().objects.create_user(
                "a", password="ClavePrueba-gestion-123"
            )
            cls.b = get_user_model().objects.create_user(
                "b", password="ClavePrueba-gestion-123"
            )
            cls.e = Especie.objects.create(
                nombre="Especie prueba",
                caracteristicas="Características prueba",
                cuidados="Cuidados prueba",
            )
            cls.c = Categoria.objects.create(nombre="General prueba")

    def setUp(self):
            self.client = APIClient(HTTP_HOST="localhost")
            self.autenticar("a")

    def autenticar(self, nombre):
            clave = base64.b64encode(f"{nombre}:ClavePrueba-gestion-123".encode()).decode()
            self.client.credentials(HTTP_AUTHORIZATION="Basic " + clave)

    def post(self, url, data):
            return self.client.post("/api/v1/" + url, data, format="json")

    def patch(self, url, data):
            return self.client.patch("/api/v1/" + url, data, format="json")

    def get(self, url):
            return self.client.get("/api/v1/" + url)

    def tanque(self, usuario=None, completo=True):
            return Pecera.objects.create(
                propietario=usuario or self.a,
                nombre="Pecera",
                litros=50 if completo else None,
                categoria=self.c if completo else None,
            )

    def inscribir(self, usuario=None):
            p = self.tanque(usuario)
            return ranking.inscribir(p.propietario_id, p.pk)

    def test_hu10_e1_aviso_respuesta(self):
            p = Publicacion.objects.create(autor=self.b, contenido="Consulta")
            self.assertEqual(
                self.post(
                    f"publicaciones/{p.pk}/comentarios", {"contenido": "Respuesta"}
                ).status_code,
                201,
            )
            n = Notificacion.objects.get()
            self.assertEqual(n.destinatario_id, self.b.pk)
            self.assertEqual(n.tipo, "respuestas")

    def test_hu10_e2_sin_evento_no_crea_aviso(self):
            Publicacion.objects.create(autor=self.a, contenido="Sin respuesta")
            self.get("notificaciones")
            self.get("notificaciones")
            self.assertFalse(Notificacion.objects.exists())

    def test_hu11_e1_cambio_de_posicion(self):
            i = self.inscribir(self.a)
            j = self.inscribir(self.b)
            self.post(f"inscripciones/{j['id']}/votos", {})
            n = Notificacion.objects.get()
            self.assertEqual(n.destinatario_id, self.a.pk)
            self.assertIn("2", n.mensaje)

    def test_hu11_e2_sin_cambio_no_avisa(self):
            i = self.inscribir(self.b)
            self.post(f"inscripciones/{i['id']}/votos", {})
            self.assertFalse(Notificacion.objects.exists())

    def test_hu12_e1_guarda_preferencias(self):
            r = self.patch(
                "preferencias-notificaciones", {"respuestas": False, "ranking": True}
            )
            self.assertEqual(r.status_code, 200)
            self.assertEqual(
                self.get("preferencias-notificaciones").data,
                {"respuestas": False, "ranking": True},
            )
            self.assertEqual(
                self.patch("preferencias-notificaciones", {"ranking": "false"}).status_code,
                400,
            )

    def test_hu12_e2_tipos_desactivados(self):
            self.patch(
                "preferencias-notificaciones", {"respuestas": False, "ranking": False}
            )
            p = Publicacion.objects.create(autor=self.a, contenido="Pregunta")
            self.autenticar("b")
            self.post(f"publicaciones/{p.pk}/comentarios", {"contenido": "Respuesta"})
            i = self.inscribir(self.a)
            j = self.inscribir(self.b)
            self.post(f"inscripciones/{i['id']}/votos", {})
            self.autenticar("a")
            self.post(f"inscripciones/{j['id']}/votos", {})
            self.assertFalse(Notificacion.objects.filter(destinatario=self.a).exists())

    def test_notificaciones_aisladas_y_respuesta_propia(self):
            p = Publicacion.objects.create(autor=self.a, contenido="Pregunta")
            self.post(f"publicaciones/{p.pk}/comentarios", {"contenido": "Mi respuesta"})
            self.assertFalse(Notificacion.objects.exists())
            Notificacion.objects.create(
                destinatario=self.b, tipo="respuestas", mensaje="Ajena", referencia_id=1
            )
            self.assertEqual(self.get("notificaciones").data["total"], 0)

    def test_fallo_aviso_revierte_comentario(self):
            p = Publicacion.objects.create(autor=self.b, contenido="Pregunta")
            with patch(
                "domain.avisos.services.emitir", side_effect=RuntimeError("fallo simulado")
            ):
                with self.assertRaises(RuntimeError):
                    crear_comentario(p.pk, self.a.pk, "Respuesta")
            self.assertFalse(Comentario.objects.exists())

    def test_fallo_aviso_revierte_voto(self):
            self.inscribir(self.a)
            j = self.inscribir(self.b)
            with patch(
                "domain.ranking.services.emitir", side_effect=RuntimeError("fallo simulado")
            ):
                with self.assertRaises(RuntimeError):
                    ranking.votar(self.a.pk, j["id"])
            self.assertFalse(Voto.objects.exists())
            self.assertFalse(Notificacion.objects.exists())
