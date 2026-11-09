from django.conf import settings
from django.db import models


class Categoria(models.Model):
    nombre = models.CharField(max_length=100, unique=True)


class Pecera(models.Model):
    propietario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT)
    nombre = models.CharField(max_length=120)
    litros = models.DecimalField(max_digits=9, decimal_places=2, null=True, blank=True)
    categoria = models.ForeignKey(
        Categoria, on_delete=models.PROTECT, null=True, blank=True
    )

    class Meta:
        constraints = [
            models.CheckConstraint(
                condition=models.Q(litros__gt=0) | models.Q(litros__isnull=True),
                name="pecera_litros_positivos",
            )
        ]


class Inscripcion(models.Model):
    pecera = models.OneToOneField(Pecera, on_delete=models.PROTECT)
    categoria = models.ForeignKey(Categoria, on_delete=models.PROTECT)


class Voto(models.Model):
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT)
    inscripcion = models.ForeignKey(
        Inscripcion, on_delete=models.PROTECT, related_name="votos"
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["usuario", "inscripcion"], name="voto_unico_por_usuario_pecera"
            )
        ]
