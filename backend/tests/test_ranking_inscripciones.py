import base64
from django.contrib.auth import get_user_model
from django.test import TestCase, override_settings
from rest_framework.test import APIClient
from domain.ranking.models import Categoria, Pecera, Inscripcion, Voto

@override_settings(DEBUG=True)
class InscripcionesTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.a=get_user_model().objects.create_user("ranking",password="Prueba-Ranking-123")
        cls.b=get_user_model().objects.create(username="otro")
        cls.c=Categoria.objects.create(nombre="General")
        cls.d=Categoria.objects.create(nombre="Otra")
    def setUp(self):
        self.client=APIClient(HTTP_HOST="localhost")
        self.client.credentials(HTTP_AUTHORIZATION="Basic "+base64.b64encode(b"ranking:Prueba-Ranking-123").decode())
    def tanque(self,usuario=None,completo=True):
        return Pecera.objects.create(propietario=usuario or self.a,nombre="Pecera",litros=50 if completo else None,categoria=self.c if completo else None)
    def inscribir(self,p):return self.client.post("/api/v1/inscripciones",{"pecera_id":p.pk},format="json")
    def test_hu7_e1_inscripcion_persistente(self):
        p=self.tanque();r=self.inscribir(p)
        self.assertEqual(r.status_code,201);self.assertTrue(Inscripcion.objects.filter(pecera=p).exists())
        self.assertEqual(self.client.get(f"/api/v1/ranking?categoria={self.c.pk}").data["resultados"][0]["pecera_id"],p.pk)
    def test_hu7_e2_incompleta_no_se_inscribe(self):
        self.assertEqual(self.inscribir(self.tanque(completo=False)).status_code,400)
        self.assertFalse(Inscripcion.objects.exists())
    def test_inscripcion_repetida(self):
        p=self.tanque();self.assertEqual(self.inscribir(p).status_code,201)
        self.assertEqual(self.inscribir(p).status_code,409);self.assertEqual(Inscripcion.objects.count(),1)
    def test_no_inscribe_pecera_ajena_o_inexistente(self):
        self.assertEqual(self.inscribir(self.tanque(self.b)).status_code,404)
        self.assertEqual(self.client.post("/api/v1/inscripciones",{"pecera_id":999999},format="json").status_code,404)
        self.assertFalse(Inscripcion.objects.exists())
    def test_hu9_e1_orden_empates_y_categoria(self):
        uno=self.inscribir(self.tanque()).data["id"];dos=self.inscribir(self.tanque()).data["id"]
        # Votos de fixture prueban consulta; no hay todavía endpoint público de voto.
        Voto.objects.create(usuario=self.b,inscripcion_id=dos)
        filas=self.client.get(f"/api/v1/ranking?categoria={self.c.pk}").data["resultados"]
        self.assertEqual([r["id"] for r in filas],[dos,uno]);self.assertEqual([r["posicion"] for r in filas],[1,2])
        Voto.objects.create(usuario=self.b,inscripcion_id=uno)
        self.assertEqual([r["posicion"] for r in self.client.get(f"/api/v1/ranking?categoria={self.c.pk}").data["resultados"]],[1,1])
        self.assertEqual(self.client.get(f"/api/v1/ranking?categoria={self.d.pk}").data["resultados"],[])
    def test_hu9_e2_categoria_vacia(self):
        r=self.client.get(f"/api/v1/ranking?categoria={self.c.pk}")
        self.assertEqual(r.status_code,200);self.assertEqual(r.data["resultados"],[]);self.assertIn("no existen",r.data["mensaje"])
    def test_categoria_ausente_o_inexistente(self):
        self.assertEqual(self.client.get("/api/v1/ranking").status_code,400)
        self.assertEqual(self.client.get("/api/v1/ranking?categoria=999999").status_code,404)
    def test_registro_y_lista_peceras_propias(self):
        r=self.client.post("/api/v1/peceras",{"nombre":"Nueva","litros":"45.50","categoria_id":self.c.pk},format="json")
        self.assertEqual(r.status_code,201)
        self.tanque(self.b)
        self.assertEqual(self.client.get("/api/v1/peceras").data["total"],1)
        self.assertGreater(len(self.client.get("/api/v1/categorias").data["resultados"]),0)
    def test_capacidad_invalida_no_guarda(self):
        for valor in ["0","-1","abc"]:
            self.assertEqual(self.client.post("/api/v1/peceras",{"nombre":"Nueva","litros":valor},format="json").status_code,400)
        self.assertFalse(Pecera.objects.exists())
    def test_identidad_obligatoria(self):
        self.client.credentials();self.assertEqual(self.client.get(f"/api/v1/ranking?categoria={self.c.pk}").status_code,401)
