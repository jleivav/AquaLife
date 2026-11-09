import base64
from concurrent.futures import ThreadPoolExecutor
from django.contrib.auth import get_user_model
from django.db import close_old_connections
from django.test import TestCase, TransactionTestCase, override_settings
from rest_framework.test import APIClient
from domain.ranking.models import Categoria, Pecera, Voto
from domain.ranking import services as ranking
from domain.errors import Conflicto

@override_settings(DEBUG=True)
class VotosTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.a=get_user_model().objects.create_user("votante",password="Prueba-Voto-12345")
        cls.b=get_user_model().objects.create(username="dueno")
        cls.c=Categoria.objects.create(nombre="General")
    def setUp(self):
        self.client=APIClient(HTTP_HOST="localhost")
        self.client.credentials(HTTP_AUTHORIZATION="Basic "+base64.b64encode(b"votante:Prueba-Voto-12345").decode())
        p=Pecera.objects.create(propietario=self.b,nombre="Otra pecera",litros=50,categoria=self.c)
        self.i=ranking.inscribir(self.b.pk,p.pk)
        self.url=f"/api/v1/inscripciones/{self.i['id']}/votos"
    def test_hu8_e1_registra_y_cuenta(self):
        r=self.client.post(self.url,{},format="json")
        self.assertEqual(r.status_code,201);self.assertEqual(r.data["votos"],1);self.assertEqual(Voto.objects.count(),1)
    def test_hu8_e2_propio_no_modifica(self):
        p=Pecera.objects.create(propietario=self.a,nombre="Mi pecera",litros=50,categoria=self.c)
        i=ranking.inscribir(self.a.pk,p.pk);antes=ranking.consultar(self.c.pk)
        r=self.client.post(f"/api/v1/inscripciones/{i['id']}/votos",{},format="json")
        self.assertEqual(r.status_code,403);self.assertEqual(ranking.consultar(self.c.pk),antes);self.assertFalse(Voto.objects.exists())
    def test_hu8_e2_repetido_no_incrementa(self):
        self.assertEqual(self.client.post(self.url,{},format="json").status_code,201)
        self.assertEqual(self.client.post(self.url,{},format="json").status_code,409)
        self.assertEqual(Voto.objects.count(),1)
    def test_no_vota_inscripcion_inexistente(self):
        self.assertEqual(self.client.post("/api/v1/inscripciones/999999/votos",{},format="json").status_code,404)
        self.assertFalse(Voto.objects.exists())
    def test_body_no_suplanta_usuario(self):
        self.assertEqual(self.client.post(self.url,{"usuario":self.b.pk},format="json").status_code,400)
        self.assertFalse(Voto.objects.exists())
    def test_sin_identidad_no_vota(self):
        self.client.credentials();self.assertEqual(self.client.post(self.url,{},format="json").status_code,401)
        self.assertFalse(Voto.objects.exists())
    def test_permite_un_voto_en_cada_pecera_distinta(self):
        p=Pecera.objects.create(propietario=self.b,nombre="Segunda",litros=50,categoria=self.c)
        i=ranking.inscribir(self.b.pk,p.pk)
        self.assertEqual(self.client.post(self.url,{},format="json").status_code,201)
        self.assertEqual(self.client.post(f"/api/v1/inscripciones/{i['id']}/votos",{},format="json").status_code,201)
        self.assertEqual(Voto.objects.count(),2)
    def test_rechazo_no_cambia_posiciones_previas(self):
        self.client.post(self.url,{},format="json");antes=ranking.consultar(self.c.pk)
        self.client.post(self.url,{},format="json")
        self.assertEqual(ranking.consultar(self.c.pk),antes)

class VotosConcurrentesTests(TransactionTestCase):
    def test_solo_un_voto_simultaneo_por_usuario(self):
        a=get_user_model().objects.create(username="dueno")
        b=get_user_model().objects.create(username="votante")
        c=Categoria.objects.create(nombre="Concurrente")
        p=Pecera.objects.create(propietario=a,nombre="Pecera",litros=40,categoria=c)
        i=ranking.inscribir(a.pk,p.pk)
        def votar():
            close_old_connections()
            try:
                ranking.votar(b.pk,i["id"]);return "aceptado"
            except Conflicto:return "rechazado"
            finally:close_old_connections()
        with ThreadPoolExecutor(max_workers=2) as pool: resultados=list(pool.map(lambda _:votar(),range(2)))
        self.assertCountEqual(resultados,["aceptado","rechazado"]);self.assertEqual(Voto.objects.count(),1)
