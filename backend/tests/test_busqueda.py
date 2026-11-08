import base64
from urllib.parse import urlencode

from django.contrib.auth import get_user_model
from django.test import TestCase, override_settings
from rest_framework.test import APIClient

from domain.errors import DatosInvalidos
from domain.foro.models import Publicacion
from domain.foro.services import listar_publicaciones


@override_settings(DEBUG=True)
class BusquedaTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.password = "ClaveLocalParaPruebas-HU3!"
        cls.autor = get_user_model().objects.create_user(
            "autor_acuario", password=cls.password
        )
        cls.primera = Publicacion.objects.create(
            autor=cls.autor, contenido="Cuidados del acuario plantado"
        )
        cls.otra = Publicacion.objects.create(
            autor=cls.autor, contenido="Alimentación de peces"
        )
        cls.segunda = Publicacion.objects.create(
            autor=cls.autor, contenido="ACUARIO: mantenimiento semanal"
        )

    def setUp(self):
        self.client = APIClient(HTTP_HOST="localhost")
        credenciales = base64.b64encode(
            f"autor_acuario:{self.password}".encode()
        ).decode()
        self.client.credentials(HTTP_AUTHORIZATION=f"Basic {credenciales}")

    def buscar(self, tema, **params):
        return self.client.get(
            "/api/v1/publicaciones?" + urlencode({"tema": tema, **params})
        )

    def test_hu3_e1_busca_tema_y_devuelve_solo_relacionadas(self):
        respuesta = self.buscar("acuario")
        self.assertEqual(respuesta.status_code, 200)
        self.assertEqual(respuesta.data["total"], 2)
        self.assertEqual(
            [p["id"] for p in respuesta.data["resultados"]],
            [self.segunda.pk, self.primera.pk],
        )
        self.assertEqual(
            respuesta.data["resultados"][0]["autor"]["nombre"], "autor_acuario"
        )

    def test_hu3_e2_sin_coincidencias_informa_sin_escribir(self):
        antes = list(Publicacion.objects.values())
        respuesta = self.buscar("tema que no existe")
        self.assertEqual(respuesta.status_code, 200)
        self.assertEqual(respuesta.data["total"], 0)
        self.assertEqual(respuesta.data["resultados"], [])
        self.assertEqual(
            respuesta.data["mensaje"], "No se encontraron publicaciones relacionadas."
        )
        self.assertEqual(list(Publicacion.objects.values()), antes)

    def test_ignora_mayusculas_y_espacios_exteriores(self):
        respuesta = self.buscar("  aCuArIo  ")
        self.assertEqual(respuesta.status_code, 200)
        self.assertEqual(respuesta.data["total"], 2)

    def test_filtra_antes_de_contar_y_paginar(self):
        respuesta = self.buscar("acuario", limite=1, desplazamiento=1)
        self.assertEqual(respuesta.data["total"], 2)
        self.assertEqual(len(respuesta.data["resultados"]), 1)
        self.assertEqual(respuesta.data["resultados"][0]["id"], self.primera.pk)

    def test_pagina_fuera_de_rango_no_afirma_ausencia_de_coincidencias(self):
        respuesta = self.buscar("acuario", desplazamiento=50)
        self.assertEqual(respuesta.data["total"], 2)
        self.assertEqual(respuesta.data["resultados"], [])
        self.assertNotIn("mensaje", respuesta.data)

    def test_sin_tema_conserva_el_listado_anterior(self):
        respuesta = self.client.get("/api/v1/publicaciones")
        self.assertEqual(respuesta.status_code, 200)
        self.assertEqual(respuesta.data["total"], 3)
        self.assertNotIn("mensaje", respuesta.data)

    def test_no_busca_en_nombre_de_autor(self):
        self.assertEqual(self.buscar("autor_acuario").data["total"], 0)

    def test_caracteres_sql_se_buscan_literalmente(self):
        for contenido, tema in [
            ("Control al 100%", "%"),
            ("Etiqueta dato_pez", "_"),
            ("Pregunta ' OR 1=1 -- literal", "' OR 1=1 --"),
        ]:
            with self.subTest(tema=tema):
                creada = Publicacion.objects.create(
                    autor=self.autor, contenido=contenido
                )
                respuesta = self.buscar(tema)
                self.assertEqual(respuesta.status_code, 200)
                self.assertEqual(
                    [p["id"] for p in respuesta.data["resultados"]], [creada.pk]
                )

    def test_tema_vacio_largo_nulo_o_repetido_devuelve_400(self):
        for tema in ["", "  ", "a" * 201, "\x00"]:
            with self.subTest(tema=repr(tema)):
                self.assertEqual(self.buscar(tema).status_code, 400)
        self.assertEqual(
            self.client.get("/api/v1/publicaciones?tema=uno&tema=dos").status_code, 400
        )

    def test_dominio_valida_busqueda_aun_sin_http(self):
        for tema in [" ", "a" * 201, "\x00", "\ud800"]:
            with self.subTest(tema=repr(tema)):
                with self.assertRaises(DatosInvalidos) as error:
                    listar_publicaciones(20, 0, tema=tema)
                self.assertEqual(error.exception.campo, "tema")

    def test_busqueda_requiere_identidad(self):
        self.client.credentials()
        self.assertEqual(self.buscar("acuario").status_code, 401)
