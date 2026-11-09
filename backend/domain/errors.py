"""Errores de negocio independientes del protocolo HTTP."""


class DatosInvalidos(Exception):
    def __init__(self, campo, mensaje):
        self.campo = campo
        self.mensaje = mensaje
        super().__init__(mensaje)


class RecursoNoEncontrado(Exception):
    pass


class Conflicto(Exception):
    pass
