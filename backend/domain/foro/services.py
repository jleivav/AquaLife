"""Reglas del foro y persistencia. Devuelve datos, nunca QuerySets."""
from domain.errors import DatosInvalidos, RecursoNoEncontrado
from domain.foro.models import Publicacion


def datos(publicacion):
    return {
        "id": publicacion.pk,
        "autor_id": publicacion.autor_id,
        "contenido": publicacion.contenido,
        "creada_en": publicacion.creada_en.isoformat(),
    }


def crear_publicacion(autor_id, contenido):
    if not isinstance(contenido, str) or not contenido.strip():
        raise DatosInvalidos("contenido", "Debe completar el contenido.")
    if "\x00" in contenido:
        raise DatosInvalidos("contenido", "El contenido contiene un carácter nulo no admitido.")
    try:
        contenido.encode("utf-8")
    except UnicodeEncodeError:
        raise DatosInvalidos("contenido", "El contenido debe ser texto Unicode válido.") from None
    return datos(Publicacion.objects.create(autor_id=autor_id, contenido=contenido.strip()))


def consultar_publicacion(publicacion_id):
    publicacion = Publicacion.objects.filter(pk=publicacion_id).first()
    if publicacion is None:
        raise RecursoNoEncontrado("No se encontró la publicación.")
    return datos(publicacion)


def listar_publicaciones(limite, desplazamiento):
    publicaciones = Publicacion.objects.all()
    total = publicaciones.count()
    pagina = publicaciones[desplazamiento : desplazamiento + limite]
    return total, [datos(publicacion) for publicacion in pagina]
