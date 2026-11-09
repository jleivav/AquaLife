from django.db import transaction
from .models import Preferencias, Notificacion


def preferencias(usuario):
    obj = Preferencias.objects.filter(usuario_id=usuario).first()
    return {
        "respuestas": obj.respuestas if obj else True,
        "ranking": obj.ranking if obj else True,
    }


@transaction.atomic
def configurar(usuario, datos):
    # Serializa también la primera creación de preferencias para este usuario.
    from django.contrib.auth import get_user_model

    get_user_model().objects.select_for_update().get(pk=usuario)
    obj, _ = Preferencias.objects.get_or_create(usuario_id=usuario)
    for campo, valor in datos.items():
        setattr(obj, campo, valor)
    obj.full_clean()
    obj.save()
    return preferencias(usuario)


def emitir(usuario, tipo, mensaje, referencia):
    if preferencias(usuario)[tipo]:
        Notificacion.objects.create(
            destinatario_id=usuario,
            tipo=tipo,
            mensaje=mensaje,
            referencia_id=referencia,
        )


def por_respuesta(comentario):
    from domain.foro.models import Publicacion

    autor = Publicacion.objects.values_list("autor_id", flat=True).get(
        pk=comentario["publicacion_id"]
    )
    if autor != comentario["autor_id"]:
        emitir(
            autor, "respuestas", "Nueva respuesta en su publicación.", comentario["id"]
        )


def listar(usuario, limite=20, desplazamiento=0):
    qs = Notificacion.objects.filter(destinatario_id=usuario)
    return {
        "total": qs.count(),
        "resultados": [
            {
                "id": n.pk,
                "tipo": n.tipo,
                "mensaje": n.mensaje,
                "referencia_id": n.referencia_id,
                "creada_en": n.creada_en.isoformat(),
            }
            for n in qs[desplazamiento : desplazamiento + limite]
        ],
    }
