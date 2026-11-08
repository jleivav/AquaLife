import ast
from pathlib import Path

from django.conf import settings
from django.test import SimpleTestCase


class SeparacionDeCapasTests(SimpleTestCase):
    def test_http_no_accede_a_modelos_y_agregacion_no_importa_http_ni_orm(self):
        for capa in ["public_api", "aggregation"]:
            for archivo in (Path(settings.BASE_DIR) / capa).glob("*.py"):
                with self.subTest(archivo=archivo.name, capa=capa):
                    arbol = ast.parse(archivo.read_text(encoding="utf-8"))
                    modulos = []
                    for nodo in ast.walk(arbol):
                        if isinstance(nodo, ast.ImportFrom):
                            modulos.append(nodo.module or "")
                        elif isinstance(nodo, ast.Import):
                            modulos.extend(alias.name for alias in nodo.names)
                    self.assertFalse(any(m.startswith("django.db") or ".models" in m for m in modulos))
                    if capa == "aggregation":
                        self.assertFalse(any(m.startswith(("rest_framework", "django.http", "public_api")) for m in modulos))
