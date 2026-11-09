from django.conf import settings
from django.db import models


class Preferencias(models.Model):
    usuario = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    respuestas = models.BooleanField(default=True)
    ranking = models.BooleanField(default=True)


class Notificacion(models.Model):
    destinatario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    tipo = models.CharField(
        max_length=20, choices=[("respuestas", "Respuestas"), ("ranking", "Ranking")]
    )
    mensaje = models.TextField()
    referencia_id = models.PositiveBigIntegerField()
    creada_en = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-creada_en", "-id"]
