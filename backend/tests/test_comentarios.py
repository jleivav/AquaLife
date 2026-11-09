import base64
import json

from django.contrib.auth import get_user_model
from django.db import IntegrityError, transaction
from django.test import TestCase, override_settings
from rest_framework.test import APIClient

from aggregation import comentarios as casos
from domain.errors import DatosInvalidos
from domain.foro import comentarios as servicio
from domain.foro.models import Comentario, Publicacion


@override_settings(DEBUG=True)
class ComentariosTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.password = "ClaveLocalParaPruebas-HU2!"
        cls.autor = get_user_model().objects.create_user(
            "publicador", password=cls.password
        )
        cls.comentarista = get_user_model().objects.create_user(
            "comentarista", password=cls.password
        )
        cls.publicacion = Publicacion.objects.create(
            autor=cls.autor, contenido="Consulta sobre cuidados"
        )
        cls.otra = Publicacion.objects.create(
            autor=cls.autor, contenido="Otra conversación"
        )

    def setUp(self):
        self.client = APIClient(HTTP_HOST="localhost")
        auth = base64.b64encode(f"comentarista:{self.password}".encode()).decode()
        self.client.credentials(HTTP_AUTHORIZATION=f"Basic {auth}")
        self.url = f"/api/v1/publicaciones/{self.publicacion.pk}/comentarios"

    def test_hu2_e1_crea_persiste_y_muestra_comentario(self):
        respuesta = self.client.post(
            self.url, {"contenido": " Mi experiencia "}, format="json"
        )
        self.assertEqual(respuesta.status_code, 201)
        comentario = Comentario.objects.get(pk=respuesta.data["id"])
        self.assertEqual(comentario.publicacion_id, self.publicacion.pk)
        self.assertEqual(comentario.autor_id, self.comentarista.pk)
        self.assertEqual(comentario.contenido, "Mi experiencia")
        self.assertEqual(respuesta.data["autor"]["nombre"], "comentarista")
        detalle = self.client.get(respuesta["Location"])
        self.assertEqual(detalle.status_code, 200)
        self.assertEqual(detalle.data, respuesta.data)
        listado = self.client.get(self.url)
        self.assertEqual(listado.data["total"], 1)
        self.assertEqual(listado.data["resultados"][0], respuesta.data)
        self.publicacion.refresh_from_db()
        self.assertEqual(self.publicacion.contenido, "Consulta sobre cuidados")

    def test_hu2_e2_vacio_no_guarda_comentario(self):
        for contenido in ["", "   ", "\n\t", "\u00a0"]:
            with self.subTest(contenido=repr(contenido)):
                respuesta = self.client.post(
                    self.url, {"contenido": contenido}, format="json"
                )
                self.assertEqual(respuesta.status_code, 400)
                self.assertEqual(
                    respuesta.data["error"]["detalles"]["contenido"],
                    ["Debe ingresar contenido."],
                )
        self.assertFalse(Comentario.objects.exists())

    def test_body_invalido_o_campos_que_suplantan_relaciones_no_escriben(self):
        entradas = [
            {},
            {"contenido": None},
            {"contenido": 1},
            {"contenido": []},
            [],
            {"contenido": "Texto", "autor_id": self.autor.pk},
            {"contenido": "Texto", "publicacion_id": self.otra.pk},
        ]
        for entrada in entradas:
            with self.subTest(entrada=entrada):
                self.assertEqual(
                    self.client.post(self.url, entrada, format="json").status_code, 400
                )
        self.assertFalse(Comentario.objects.exists())

    def test_publicacion_inexistente_no_admite_creacion_ni_listado(self):
        url = "/api/v1/publicaciones/999999/comentarios"
        self.assertEqual(
            self.client.post(url, {"contenido": "Texto"}, format="json").status_code,
            404,
        )
        self.assertEqual(self.client.get(url).status_code, 404)
        self.assertFalse(Comentario.objects.exists())

    def test_listado_separa_publicaciones_y_no_expone_comentarios_ajenos(self):
        propio = servicio.crear_comentario(
            self.publicacion.pk, self.comentarista.pk, "Aquí"
        )
        servicio.crear_comentario(
            self.otra.pk, self.comentarista.pk, "En otra publicación"
        )
        respuesta = self.client.get(self.url)
        self.assertEqual(respuesta.data["total"], 1)
        self.assertEqual(
            [r["id"] for r in respuesta.data["resultados"]], [propio["id"]]
        )

    def test_detalle_no_permite_cambiar_la_publicacion_del_comentario(self):
        comentario = servicio.crear_comentario(
            self.otra.pk, self.comentarista.pk, "Otro hilo"
        )
        self.assertEqual(
            self.client.get(f"{self.url}/{comentario['id']}").status_code, 404
        )
        self.assertEqual(self.client.get(f"{self.url}/999999").status_code, 404)

    def test_listado_vacio_y_paginacion_cronologica(self):
        respuesta = self.client.get(self.url)
        self.assertEqual(respuesta.status_code, 200)
        self.assertEqual(respuesta.data["resultados"], [])
        primero = servicio.crear_comentario(
            self.publicacion.pk, self.autor.pk, "Primero"
        )
        segundo = servicio.crear_comentario(
            self.publicacion.pk, self.comentarista.pk, "Segundo"
        )
        respuesta = self.client.get(f"{self.url}?limite=1&desplazamiento=0")
        self.assertEqual(respuesta.data["total"], 2)
        self.assertEqual(respuesta.data["resultados"][0]["id"], primero["id"])
        respuesta = self.client.get(f"{self.url}?limite=1&desplazamiento=1")
        self.assertEqual(respuesta.data["resultados"][0]["id"], segundo["id"])

    def test_sin_autenticar_no_comenta_y_metodo_no_permitido(self):
        self.assertEqual(self.client.delete(self.url).status_code, 405)
        self.client.credentials()
        self.assertEqual(
            self.client.post(
                self.url, {"contenido": "Texto"}, format="json"
            ).status_code,
            401,
        )
        self.assertFalse(Comentario.objects.exists())

    def test_json_y_parametros_invalidos(self):
        self.assertEqual(
            self.client.post(
                self.url, '{"contenido":', content_type="application/json"
            ).status_code,
            400,
        )
        self.assertEqual(
            self.client.post(self.url, "Texto", content_type="text/plain").status_code,
            415,
        )
        for query in ["limite=101", "desplazamiento=-1", "autor_id=1"]:
            with self.subTest(query=query):
                self.assertEqual(
                    self.client.get(f"{self.url}?{query}").status_code, 400
                )
        self.assertFalse(Comentario.objects.exists())

    def test_texto_no_almacenable_se_rechaza(self):
        for contenido in ["Texto\x00", "Texto\ud800"]:
            respuesta = self.client.post(
                self.url,
                json.dumps({"contenido": contenido}, ensure_ascii=True),
                content_type="application/json",
            )
            self.assertEqual(respuesta.status_code, 400)
        self.assertFalse(Comentario.objects.exists())

    def test_dominio_y_base_impiden_contenido_vacio(self):
        with self.assertRaises(DatosInvalidos):
            servicio.crear_comentario(self.publicacion.pk, self.comentarista.pk, "  ")
        with self.assertRaises(IntegrityError), transaction.atomic():
            Comentario.objects.create(
                publicacion=self.publicacion, autor=self.comentarista, contenido="  "
            )
        self.assertFalse(Comentario.objects.exists())

    def test_agregacion_compone_autor_sin_exponer_credenciales(self):
        resultado = casos.comentar(
            self.publicacion.pk, self.comentarista.pk, "Respuesta"
        )
        self.assertEqual(resultado["publicacion_id"], self.publicacion.pk)
        self.assertEqual(set(resultado["autor"]), {"id", "nombre"})
        self.assertNotIn("autor_id", resultado)
