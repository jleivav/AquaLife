"""Persistencia de comentarios y verificación de su publicación de origen."""

from django.db import transaction
from domain.errors import RecursoNoEncontrado
from domain.foro.contenido import validar_contenido
from domain.foro.models import Comentario, Publicacion


def exigir_publicacion(publicacion_id):
    if not Publicacion.objects.filter(pk=publicacion_id).exists():
        raise RecursoNoEncontrado("No se encontró la publicación.")


def datos(comentario):
    return {
        "id": comentario.pk,
        "publicacion_id": comentario.publicacion_id,
        "autor_id": comentario.autor_id,
        "contenido": comentario.contenido,
        "creada_en": comentario.creada_en.isoformat(),
    }


@transaction.atomic
def crear_comentario(publicacion_id, autor_id, contenido):
    exigir_publicacion(publicacion_id)
    contenido = validar_contenido(contenido, "Debe ingresar contenido.")
    comentario = Comentario.objects.create(
        publicacion_id=publicacion_id, autor_id=autor_id, contenido=contenido
    )
    resultado = datos(comentario)
    return resultado


def consultar_comentario(publicacion_id, comentario_id):
    comentario = Comentario.objects.filter(
        pk=comentario_id, publicacion_id=publicacion_id
    ).first()
    if comentario is None:
        raise RecursoNoEncontrado("No se encontró el comentario en esa publicación.")
    return datos(comentario)


def listar_comentarios(publicacion_id, limite, desplazamiento):
    exigir_publicacion(publicacion_id)
    comentarios = Comentario.objects.filter(publicacion_id=publicacion_id)
    return comentarios.count(), [
        datos(comentario)
        for comentario in comentarios[desplazamiento : desplazamiento + limite]
    ]
