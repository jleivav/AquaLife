from django.forms.models import model_to_dict
from domain.errors import DatosInvalidos, RecursoNoEncontrado
from .models import Especie, Pez


def especie(id):
    obj = Especie.objects.filter(pk=id).first()
    if obj is None:
        raise RecursoNoEncontrado("No se encontró información sobre esa especie.")
    return model_to_dict(obj)


def especies(busqueda="", limite=20, desplazamiento=0):
    qs = Especie.objects.filter(nombre__icontains=busqueda).order_by("nombre", "id")
    return {
        "total": qs.count(),
        "resultados": [
            model_to_dict(x) for x in qs[desplazamiento : desplazamiento + limite]
        ],
        "mensaje": (
            "Sin información para esa especie."
            if not qs.exists()
            else "Especies encontradas."
        ),
    }


def crear(usuario, datos):
    especie(datos["especie_id"])
    obj = Pez(
        propietario_id=usuario,
        especie_id=datos["especie_id"],
        nombre=nombre_limpio(datos["nombre"]),
    )
    obj.full_clean()
    obj.save()
    return model_to_dict(obj)


def listar(usuario, limite=20, desplazamiento=0):
    qs = Pez.objects.filter(propietario_id=usuario).order_by("id")
    return {
        "total": qs.count(),
        "resultados": [
            model_to_dict(x) for x in qs[desplazamiento : desplazamiento + limite]
        ],
    }


def detalle(usuario, id):
    obj = Pez.objects.filter(propietario_id=usuario, pk=id).first()
    if obj is None:
        raise RecursoNoEncontrado("No se encontró el pez del usuario.")
    return model_to_dict(obj)



def nombre_limpio(nombre):
    if not isinstance(nombre, str) or not nombre.strip():
        raise DatosInvalidos("nombre", "Debe ingresar nombre.")
    if "\x00" in nombre:
        raise DatosInvalidos("nombre", "No se admite carácter NUL.")
    try:
        nombre.encode("utf-8")
    except UnicodeEncodeError:
        raise DatosInvalidos("nombre", "Debe ser texto Unicode válido.") from None
    return nombre.strip()


def editar(usuario, id, datos):
    obj = Pez.objects.filter(propietario_id=usuario, pk=id).first()
    if obj is None:
        raise RecursoNoEncontrado("No se encontró el pez del usuario.")
    if "especie_id" in datos:
        especie(datos["especie_id"])
        obj.especie_id = datos["especie_id"]
    if "nombre" in datos:
        obj.nombre = nombre_limpio(datos["nombre"])
    obj.full_clean()
    obj.save()
    return model_to_dict(obj)
