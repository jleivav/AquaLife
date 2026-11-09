"""Coordina datos de comentarios y autores sin acceder al ORM."""

from domain.foro import comentarios as foro
from domain.usuarios import services as usuarios


def con_autor(comentario, autores):
    resultado = dict(comentario)
    resultado["autor"] = autores[resultado.pop("autor_id")]
    return resultado


def comentar(publicacion_id, usuario_id, contenido):
    autor = usuarios.obtener_autor_activo(usuario_id)
    comentario = foro.crear_comentario(publicacion_id, autor["id"], contenido)
    return con_autor(comentario, {autor["id"]: autor})


def consultar(publicacion_id, comentario_id):
    comentario = foro.consultar_comentario(publicacion_id, comentario_id)
    autores = usuarios.obtener_autores([comentario["autor_id"]])
    return con_autor(comentario, autores)


def listar(publicacion_id, limite, desplazamiento):
    total, comentarios = foro.listar_comentarios(publicacion_id, limite, desplazamiento)
    autores = usuarios.obtener_autores({c["autor_id"] for c in comentarios})
    return {
        "total": total,
        "limite": limite,
        "desplazamiento": desplazamiento,
        "resultados": [con_autor(c, autores) for c in comentarios],
    }
