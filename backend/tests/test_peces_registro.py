import base64
from django.contrib.auth import get_user_model
from django.test import TestCase, override_settings
from rest_framework.test import APIClient
from domain.peces.models import Especie, Pez

@override_settings(DEBUG=True)
class RegistroTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.usuario=get_user_model().objects.create_user("peces", password="Prueba-Peces-123456")
        cls.otro=get_user_model().objects.create_user("otro", password="Prueba-Peces-123456")
        cls.especie=Especie.objects.create(nombre="Especie prueba",caracteristicas="Características",cuidados="Cuidados")
    def setUp(self):
        self.client=APIClient(HTTP_HOST="localhost")
        self.client.credentials(HTTP_AUTHORIZATION="Basic "+base64.b64encode(b"peces:Prueba-Peces-123456").decode())
    def post(self,data): return self.client.post("/api/v1/peces",data,format="json")
    def test_hu4_e1_registra_y_lista(self):
        r=self.post({"nombre":"Nemo","especie_id":self.especie.pk})
        self.assertEqual(r.status_code,201)
        self.assertEqual(Pez.objects.get().propietario_id,self.usuario.pk)
        self.assertEqual(self.client.get("/api/v1/peces").data["total"],1)
    def test_hu4_e2_datos_incompletos(self):
        for d in [{},{"nombre":"Solo"},{"nombre":" ","especie_id":self.especie.pk}]:
            self.assertEqual(self.post(d).status_code,400)
        self.assertFalse(Pez.objects.exists())
    def test_hu5_e1_especie_encontrada(self):
        r=self.client.get(f"/api/v1/especies/{self.especie.pk}")
        self.assertEqual(r.status_code,200);self.assertEqual(r.data["cuidados"],"Cuidados")
    def test_hu5_e2_especie_ausente(self):
        self.assertEqual(self.client.get("/api/v1/especies/999999").status_code,404)
        r=self.client.get("/api/v1/especies?busqueda=ausente")
        self.assertEqual(r.data["total"],0);self.assertIn("Sin información",r.data["mensaje"])
    def test_especie_inexistente_no_registra(self):
        self.assertEqual(self.post({"nombre":"Nemo","especie_id":999999}).status_code,404)
        self.assertFalse(Pez.objects.exists())
    def test_no_admite_propietario_en_body(self):
        self.assertEqual(self.post({"nombre":"Nemo","especie_id":self.especie.pk,"propietario":self.otro.pk}).status_code,400)
    def test_datos_ajenos_no_son_visibles(self):
        pez=Pez.objects.create(propietario=self.otro,especie=self.especie,nombre="Ajeno")
        self.assertEqual(self.client.get("/api/v1/peces").data["total"],0)
        self.assertEqual(self.client.get(f"/api/v1/peces/{pez.pk}").status_code,404)
    def test_detalle_compone_la_especie(self):
        r=self.post({"nombre":"Nemo","especie_id":self.especie.pk})
        r=self.client.get(f"/api/v1/peces/{r.data['id']}")
        self.assertEqual(r.data["especie_detalle"]["nombre"],"Especie prueba")
    def test_paginacion_y_busqueda_catalogo(self):
        self.assertEqual(self.client.get("/api/v1/especies?busqueda=PRUEBA&limite=1").data["total"],1)
        self.assertEqual(self.client.get("/api/v1/especies?limite=0").status_code,400)
    def test_identidad_requerida(self):
        self.client.credentials()
        self.assertEqual(self.post({"nombre":"Nemo","especie_id":self.especie.pk}).status_code,401)
