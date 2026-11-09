import base64
from django.test import TestCase, override_settings
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from domain.peces.models import Especie, Pez

@override_settings(DEBUG=True)
class EdicionTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.a=get_user_model().objects.create_user("editor",password="Prueba-Edicion-123")
        cls.b=get_user_model().objects.create_user("otro",password="Prueba-Edicion-123")
        cls.e=Especie.objects.create(nombre="Uno",caracteristicas="Prueba",cuidados="Prueba")
        cls.e2=Especie.objects.create(nombre="Dos",caracteristicas="Prueba",cuidados="Prueba")
    def setUp(self):
        self.client=APIClient(HTTP_HOST="localhost")
        self.client.credentials(HTTP_AUTHORIZATION="Basic "+base64.b64encode(b"editor:Prueba-Edicion-123").decode())
        self.pez=Pez.objects.create(propietario=self.a,especie=self.e,nombre="Antes")
    def editar(self,data,id=None): return self.client.patch(f"/api/v1/peces/{id or self.pez.pk}",data,format="json")
    def test_hu6_e1_edita_nombre_y_especie(self):
        r=self.editar({"nombre":"Después","especie_id":self.e2.pk})
        self.assertEqual(r.status_code,200);self.pez.refresh_from_db()
        self.assertEqual(self.pez.nombre,"Después");self.assertEqual(self.pez.especie_id,self.e2.pk)
    def test_hu6_e2_invalido_no_modifica(self):
        for data in [{"nombre":" "},{"nombre":None},{"nombre":"a"*121},{"especie_id":999999},{}]:
            self.assertIn(self.editar(data).status_code,[400,404])
        self.pez.refresh_from_db();self.assertEqual(self.pez.nombre,"Antes");self.assertEqual(self.pez.especie_id,self.e.pk)
    def test_pez_ajeno_no_se_edita(self):
        p=Pez.objects.create(propietario=self.b,especie=self.e,nombre="Ajeno")
        self.assertEqual(self.editar({"nombre":"Otro"},p.pk).status_code,404)
        p.refresh_from_db();self.assertEqual(p.nombre,"Ajeno")
    def test_edicion_parcial_conserva_especie(self):
        self.assertEqual(self.editar({"nombre":"Nuevo"}).status_code,200)
        self.pez.refresh_from_db();self.assertEqual(self.pez.especie_id,self.e.pk)
    def test_no_cambia_propietario_y_no_edita_inexistente(self):
        self.assertEqual(self.editar({"propietario":self.b.pk}).status_code,400)
        self.assertEqual(self.editar({"nombre":"Otro"},999999).status_code,404)
    def test_sin_identidad_no_edita(self):
        self.client.credentials()
        self.assertEqual(self.editar({"nombre":"Otro"}).status_code,401)
        self.pez.refresh_from_db();self.assertEqual(self.pez.nombre,"Antes")
