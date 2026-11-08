import json
import secrets

from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand, CommandError
from django.db import transaction


class Command(BaseCommand):
    help = "Prepara dos cuentas locales C2 y guarda sus claves fuera de Git."

    def handle(self, *args, **options):
        if not settings.DEBUG:
            raise CommandError("Las cuentas demo requieren DJANGO_DEBUG=true.")
        ruta = settings.BASE_DIR.parent / ".aqualife-demo.local"
        if ruta.exists():
            cuentas = json.loads(ruta.read_text(encoding="utf-8"))
        else:
            usuarios = get_user_model()
            if usuarios.objects.filter(username__in=["joaquin_demo", "kenneth_demo"]).exists():
                raise CommandError("Existen cuentas demo sin archivo local; revisar sin sobrescribirlas.")
            cuentas = {nombre: secrets.token_urlsafe(24) for nombre in ["joaquin_demo", "kenneth_demo"]}
            with ruta.open("x", encoding="utf-8") as archivo:
                json.dump(cuentas, archivo, indent=2)
        with transaction.atomic():
            for nombre, password in cuentas.items():
                usuario, creado = get_user_model().objects.get_or_create(username=nombre)
                if creado:
                    usuario.set_password(password)
                    usuario.save(update_fields=["password"])
                elif not usuario.check_password(password):
                    raise CommandError("Una contraseña demo no coincide. No se sobrescribió.")
        self.stdout.write(self.style.SUCCESS("Cuentas demo disponibles; claves en .aqualife-demo.local."))
