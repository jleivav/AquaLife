"""Casos de uso: combina datos del foro con los autores."""

from domain.foro import services as foro
from domain.usuarios import services as usuarios


def con_autor(publicacion, autores):
    resultado = dict(publicacion)
    resultado["autor"] = autores[resultado.pop("autor_id")]
    return resultado


def publicar(usuario_id, contenido):
    autor = usuarios.obtener_autor_activo(usuario_id)
    publicacion = foro.crear_publicacion(autor["id"], contenido)
    return con_autor(publicacion, {autor["id"]: autor})


def consultar(publicacion_id):
    publicacion = foro.consultar_publicacion(publicacion_id)
    autores = usuarios.obtener_autores([publicacion["autor_id"]])
    return con_autor(publicacion, autores)


def listar(limite, desplazamiento, tema=None):
    total, publicaciones = foro.listar_publicaciones(limite, desplazamiento, tema=tema)
    autores = usuarios.obtener_autores({p["autor_id"] for p in publicaciones})
    resultado = {
        "total": total,
        "limite": limite,
        "desplazamiento": desplazamiento,
        "resultados": [con_autor(p, autores) for p in publicaciones],
    }
    if tema is not None and total == 0:
        resultado["mensaje"] = "No se encontraron publicaciones relacionadas."
    return resultado
