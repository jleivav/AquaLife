"""Casos de uso de inscripción y consulta de ranking."""
from domain.ranking import services as ranking

def crear_pecera(usuario, datos):
    return ranking.crear_pecera(usuario, datos)

def listar_peceras(usuario, **pagina):
    return ranking.peceras(usuario, **pagina)

def categorias():
    return ranking.categorias()

def inscribir(usuario, pecera_id):
    return ranking.inscribir(usuario, pecera_id)

def ver_ranking(categoria):
    return ranking.consultar(categoria)
