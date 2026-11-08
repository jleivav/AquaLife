"""Consulta privada de autores. No recibe objetos HTTP."""
from django.contrib.auth import get_user_model

from domain.errors import RecursoNoEncontrado


def obtener_autores(ids):
    return {
        usuario.pk: {"id": usuario.pk, "nombre": usuario.get_username()}
        for usuario in get_user_model().objects.filter(pk__in=ids)
    }


def obtener_autor_activo(usuario_id):
    usuario = get_user_model().objects.filter(pk=usuario_id, is_active=True).first()
    if usuario is None:
        raise RecursoNoEncontrado("El autor no está disponible.")
    return {"id": usuario.pk, "nombre": usuario.get_username()}
