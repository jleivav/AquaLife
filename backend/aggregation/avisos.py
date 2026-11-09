from domain.avisos import services as avisos

def preferencias(usuario):
    return avisos.preferencias(usuario)

def guardar_preferencias(usuario, datos):
    return avisos.configurar(usuario, datos)

def notificaciones(usuario, **pagina):
    return avisos.listar(usuario, **pagina)
