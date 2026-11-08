"""Demostración HTTP local HU1 con verificación independiente de persistencia.

Inicia y detiene su propio servidor. Deja una publicación de demostración real.
No imprime contraseñas ni credenciales de cabeceras.
"""
import base64
import json
import socket
import subprocess
import sys
import time
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen
from uuid import uuid4

import psycopg

ROOT = Path(__file__).resolve().parents[2]


def main():
    cuentas = json.loads((ROOT / ".aqualife-demo.local").read_text(encoding="utf-8"))
    config = json.loads((ROOT / ".aqualife-backend.local").read_text(encoding="utf-8"))
    auth = base64.b64encode(f"joaquin_demo:{cuentas['joaquin_demo']}".encode()).decode()
    with socket.socket() as disponible:
        disponible.bind(("127.0.0.1", 0))
        puerto = disponible.getsockname()[1]
    base = f"http://127.0.0.1:{puerto}"

    def pedir(ruta, body=None):
        datos = json.dumps(body).encode("utf-8") if body is not None else None
        request = Request(
            base + ruta, data=datos,
            headers={"Authorization": f"Basic {auth}", "Content-Type": "application/json"},
        )
        try:
            with urlopen(request, timeout=5) as respuesta:
                return respuesta.status, json.load(respuesta)
        except HTTPError as error:
            return error.code, json.load(error)

    proceso = subprocess.Popen(
        [sys.executable, str(ROOT / "backend/manage.py"), "runserver", f"127.0.0.1:{puerto}", "--noreload"],
        cwd=ROOT, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
    )
    try:
        for _ in range(60):
            if proceso.poll() is not None:
                raise RuntimeError("El servidor de demostración no pudo arrancar.")
            try:
                estado, inicial = pedir("/api/v1/publicaciones")
                if estado != 200:
                    raise RuntimeError(f"Listado inicial devolvió {estado}.")
                break
            except (URLError, TimeoutError):
                time.sleep(0.25)
        else:
            raise RuntimeError("El servidor no respondió a tiempo.")
        contenido = f"Demostración HU1: publicación persistente {uuid4().hex[:8]}"
        estado, creada = pedir("/api/v1/publicaciones", {"contenido": contenido})
        assert estado == 201, f"Creación devolvió {estado}"
        estado, consultada = pedir(f"/api/v1/publicaciones/{creada['id']}")
        assert estado == 200 and consultada["contenido"] == contenido
        estado, _ = pedir("/api/v1/publicaciones", {"contenido": "  "})
        assert estado == 400, f"Contenido vacío devolvió {estado}"
        _, listado = pedir("/api/v1/publicaciones")
        assert listado["total"] == inicial["total"] + 1
        with psycopg.connect(
            host=config["DB_HOST"], port=config["DB_PORT"], dbname=config["DB_NAME"],
            user=config["DB_USER"], password=config["DB_PASSWORD"], connect_timeout=5,
        ) as db:
            fila = db.execute(
                "SELECT contenido FROM foro_publicacion WHERE id = %s", (creada["id"],)
            ).fetchone()
            assert fila is not None and fila[0] == contenido
        print(f"HTTP 201: publicación {creada['id']} creada por {creada['autor']['nombre']}.")
        print("HTTP 200: publicación consultada por su ID.")
        print("HTTP 400: contenido vacío rechazado sin crear otra publicación.")
        print("PostgreSQL: persistencia confirmada desde una conexión independiente.")
    finally:
        proceso.terminate()
        try:
            proceso.wait(timeout=5)
        except subprocess.TimeoutExpired:
            proceso.kill()
            proceso.wait(timeout=5)


if __name__ == "__main__":
    main()
