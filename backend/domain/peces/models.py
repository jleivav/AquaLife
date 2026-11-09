from django.conf import settings
from django.db import models


class Especie(models.Model):
    nombre = models.CharField(max_length=120, unique=True)
    caracteristicas = models.TextField()
    cuidados = models.TextField()


class Pez(models.Model):
    propietario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT)
    especie = models.ForeignKey(Especie, on_delete=models.PROTECT)
    nombre = models.CharField(max_length=120)

    class Meta:
        constraints = [
            models.CheckConstraint(
                condition=~models.Q(nombre__regex=r"^\s*$"), name="pez_nombre_no_vacio"
            )
        ]
