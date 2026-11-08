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


def listar_publicaciones(limite, desplazamiento, tema=None):
    publicaciones = Publicacion.objects.all()
    if tema is not None:
        if not isinstance(tema, str) or not tema.strip():
            raise DatosInvalidos("tema", "Debe ingresar un tema para buscar.")
        tema = tema.strip()
        if len(tema) > 200 or "\x00" in tema:
            raise DatosInvalidos("tema", "El tema debe tener hasta 200 caracteres sin NUL.")
        try:
            tema.encode("utf-8")
        except UnicodeEncodeError:
            raise DatosInvalidos("tema", "Debe ser texto Unicode válido.") from None
        publicaciones = publicaciones.filter(contenido__icontains=tema)
    total = publicaciones.count()
    pagina = publicaciones[desplazamiento : desplazamiento + limite]
    return total, [datos(publicacion) for publicacion in pagina]
