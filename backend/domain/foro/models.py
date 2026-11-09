from django.conf import settings
from django.db import models


class Publicacion(models.Model):
    autor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT)
    contenido = models.TextField()
    creada_en = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-creada_en", "-id"]
        constraints = [
            models.CheckConstraint(
                condition=~models.Q(contenido__regex=r"^\s*$"),
                name="publicacion_contenido_no_vacio",
            )
        ]


class Comentario(models.Model):
    publicacion = models.ForeignKey(
        Publicacion, on_delete=models.PROTECT, related_name="comentarios"
    )
    autor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT)
    contenido = models.TextField()
    creada_en = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["creada_en", "id"]
        constraints = [
            models.CheckConstraint(
                condition=~models.Q(contenido__regex=r"^\s*$"),
                name="comentario_contenido_no_vacio",
            )
        ]
