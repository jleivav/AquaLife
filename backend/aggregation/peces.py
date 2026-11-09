"""Casos de uso de peces: coordina ejemplares y fichas de especies."""
from domain.peces import services as peces

def registrar_pez(usuario, datos):
    resultado = peces.crear(usuario, datos)
    resultado["especie_detalle"] = peces.especie(resultado["especie"])
    return resultado

def ver_pez(usuario, id):
    resultado = peces.detalle(usuario, id)
    resultado["especie_detalle"] = peces.especie(resultado["especie"])
    return resultado

def listar_peces(usuario, **pagina):
    return peces.listar(usuario, **pagina)

def buscar_especies(**params):
    return peces.especies(**params)

def ver_especie(id):
    return peces.especie(id)


def editar_pez(usuario, id, datos):
    resultado = peces.editar(usuario, id, datos)
    resultado["especie_detalle"] = peces.especie(resultado["especie"])
    return resultado
