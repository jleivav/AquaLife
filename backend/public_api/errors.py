from rest_framework.exceptions import NotFound, ValidationError
from rest_framework.views import exception_handler as drf_exception_handler

from domain.errors import DatosInvalidos, RecursoNoEncontrado


def exception_handler(exc, context):
    if isinstance(exc, DatosInvalidos):
        exc = ValidationError({exc.campo: [exc.mensaje]})
    elif isinstance(exc, RecursoNoEncontrado):
        exc = NotFound(str(exc))
    response = drf_exception_handler(exc, context)
    if response is not None:
        codigos = {
            400: "datos_invalidos", 401: "no_autenticado", 403: "no_permitido",
            404: "no_encontrado", 405: "metodo_no_permitido",
            406: "formato_respuesta_no_admitido", 415: "tipo_contenido_no_admitido",
        }
        response.data = {
            "error": {
                "codigo": codigos.get(response.status_code, "error_api"),
                "detalles": response.data,
            }
        }
    return response
