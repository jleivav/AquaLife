from django.db import transaction
from django.db.models import Count
from domain.errors import DatosInvalidos, RecursoNoEncontrado, Conflicto
from .models import Categoria, Pecera, Inscripcion, Voto

def validar_contenido(valor, mensaje, campo):
    if not isinstance(valor, str) or not valor.strip():
        raise DatosInvalidos(campo, mensaje)
    if "\x00" in valor:
        raise DatosInvalidos(campo, "No se admite NUL.")
    try:
        valor.encode("utf-8")
    except UnicodeEncodeError:
        raise DatosInvalidos(campo, "Debe ser texto Unicode válido.") from None
    return valor.strip()

def categoria(id, bloquear=False):
    qs = Categoria.objects.select_for_update() if bloquear else Categoria.objects
    obj = qs.filter(pk=id).first()
    if obj is None:
        raise RecursoNoEncontrado("Categoría inexistente.")
    return obj

def categorias():
    return list(Categoria.objects.order_by("nombre").values("id", "nombre"))

def datos_pecera(p):
    return {
        "id": p.pk,
        "propietario": p.propietario_id,
        "nombre": p.nombre,
        "litros": str(p.litros) if p.litros is not None else None,
        "categoria_id": p.categoria_id,
    }

def crear_pecera(usuario, datos):
    if datos.get("categoria_id") is not None:
        categoria(datos["categoria_id"])
    p = Pecera(
        propietario_id=usuario,
        nombre=validar_contenido(datos["nombre"], "Ingrese nombre.", "nombre"),
        litros=datos.get("litros"),
        categoria_id=datos.get("categoria_id"),
    )
    p.full_clean()
    p.save()
    return datos_pecera(p)

def peceras(usuario, limite=20, desplazamiento=0):
    qs = Pecera.objects.filter(propietario_id=usuario).order_by("id")
    return {
        "total": qs.count(),
        "resultados": [
            datos_pecera(x) for x in qs[desplazamiento : desplazamiento + limite]
        ],
    }

def posiciones(id):
    filas = (
        Inscripcion.objects.filter(categoria_id=id)
        .select_related("pecera")
        .annotate(cantidad=Count("votos"))
        .order_by("-cantidad", "id")
    )
    resultado = []
    anterior = None
    puesto = 0
    for fila in filas:
        if anterior != fila.cantidad:
            puesto += 1
        anterior = fila.cantidad
        resultado.append(
            {
                "id": fila.pk,
                "pecera_id": fila.pecera_id,
                "propietario": fila.pecera.propietario_id,
                "nombre": fila.pecera.nombre,
                "votos": fila.cantidad,
                "posicion": puesto,
            }
        )
    return resultado

def consultar(id):
    categoria(id)
    filas = posiciones(id)
    return {
        "categoria_id": id,
        "resultados": filas,
        "mensaje": (
            "Ranking disponible."
            if filas
            else "Actualmente no existen participantes en esta categoría."
        ),
    }

@transaction.atomic
def inscribir(usuario, pecera_id):
    # Todas las mutaciones del ranking adquieren primero el bloqueo de categoría.
    p = Pecera.objects.filter(pk=pecera_id, propietario_id=usuario).first()
    if p is None:
        raise RecursoNoEncontrado("Pecera del usuario inexistente.")
    if not p.nombre.strip() or p.litros is None or p.categoria_id is None:
        raise DatosInvalidos(
            "pecera_id",
            "Complete nombre, capacidad en litros y categoría antes de inscribir.",
        )
    categoria(p.categoria_id, bloquear=True)
    if Inscripcion.objects.filter(pecera=p).exists():
        raise Conflicto("La pecera ya está inscrita.")
    i = Inscripcion.objects.create(pecera=p, categoria_id=p.categoria_id)
    despues = posiciones(p.categoria_id)
    return next(x for x in despues if x["id"] == i.pk)
