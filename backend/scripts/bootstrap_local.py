"""Crea exclusivamente la base de desarrollo AquaLife; no modifica otras bases."""
import json
import os
import secrets
from pathlib import Path

import psycopg
from psycopg import sql

ROOT = Path(__file__).resolve().parents[2]
config_path = ROOT / ".aqualife-backend.local"


def main():
    password_admin = os.environ.get("AQUALIFE_ADMIN_PASSWORD")
    if not password_admin:
        raise SystemExit("Falta AQUALIFE_ADMIN_PASSWORD. Consulte backend/README.md.")
    with psycopg.connect(
        host="127.0.0.1", port=5432, dbname="postgres", user="postgres",
        password=password_admin, autocommit=True, connect_timeout=5,
    ) as admin:
        if config_path.exists():
            config = json.loads(config_path.read_text(encoding="utf-8"))
        else:
            existentes = admin.execute(
                "SELECT 1 FROM pg_roles WHERE rolname = %s", ("aqualife_dev",)
            ).fetchone()
            base_existente = admin.execute(
                "SELECT 1 FROM pg_database WHERE datname = %s", ("aqualife",)
            ).fetchone()
            if existentes or base_existente:
                raise SystemExit("Ya existe el rol o la base AquaLife; revisar antes de configurarlos.")
            config = {
                "DJANGO_SECRET_KEY": secrets.token_urlsafe(64),
                "DJANGO_DEBUG": "true",
                "DB_NAME": "aqualife", "DB_USER": "aqualife_dev",
                "DB_PASSWORD": secrets.token_urlsafe(32),
                "DB_HOST": "127.0.0.1", "DB_PORT": "5432",
            }
            with config_path.open("x", encoding="utf-8") as archivo:
                json.dump(config, archivo, indent=2)
        # No permite que un archivo editado redirija esta operación a otra base o rol.
        if config["DB_USER"] != "aqualife_dev" or config["DB_NAME"] != "aqualife":
            raise SystemExit("Este preparador solo administra aqualife / aqualife_dev.")
        if not admin.execute(
            "SELECT 1 FROM pg_roles WHERE rolname = %s", (config["DB_USER"],)
        ).fetchone():
            admin.execute(
                sql.SQL("CREATE ROLE {} LOGIN CREATEDB NOSUPERUSER NOCREATEROLE PASSWORD {}").format(
                    sql.Identifier(config["DB_USER"]), sql.Literal(config["DB_PASSWORD"])
                )
            )
        if not admin.execute(
            "SELECT 1 FROM pg_database WHERE datname = %s", (config["DB_NAME"],)
        ).fetchone():
            admin.execute(
                sql.SQL("CREATE DATABASE {} OWNER {} ENCODING 'UTF8' TEMPLATE template0").format(
                    sql.Identifier(config["DB_NAME"]), sql.Identifier(config["DB_USER"])
                )
            )
    with psycopg.connect(
        host=config["DB_HOST"], port=config["DB_PORT"], dbname=config["DB_NAME"],
        user=config["DB_USER"], password=config["DB_PASSWORD"], connect_timeout=5,
    ) as conexion:
        resultado = conexion.execute("SELECT current_database(), current_user").fetchone()
    print(f"Base preparada: {resultado[0]}; rol de desarrollo: {resultado[1]}.")
    print("Configuración privada guardada en .aqualife-backend.local; no publicar.")


if __name__ == "__main__":
    main()
