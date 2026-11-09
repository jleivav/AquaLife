"""Validación compartida del texto persistido por el foro."""

from domain.errors import DatosInvalidos


def validar_contenido(contenido, mensaje_vacio, campo="contenido"):
    if not isinstance(contenido, str) or not contenido.strip():
        raise DatosInvalidos(campo, mensaje_vacio)
    if "\x00" in contenido:
        raise DatosInvalidos(campo, "El texto contiene un carácter nulo no admitido.")
    try:
        contenido.encode("utf-8")
    except UnicodeEncodeError:
        raise DatosInvalidos(campo, "Debe ser texto Unicode válido.") from None
    return contenido.strip()
