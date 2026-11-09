from rest_framework import serializers
from rest_framework.views import APIView
from rest_framework.response import Response
from aggregation import peces as gestion
from .serializers import PaginaSerializer

class Entrada(serializers.Serializer):
    def to_internal_value(self, data):
        if isinstance(data, dict):
            extras = set(data) - set(self.fields)
            if extras:
                raise serializers.ValidationError(
                    {x: ["Campo no permitido."] for x in sorted(extras)}
                )
        result = super().to_internal_value(data)
        if self.partial and not result:
            raise serializers.ValidationError(
                {"non_field_errors": ["Debe enviar al menos un campo."]}
            )
        return result

class PezEntrada(Entrada):
    nombre = serializers.CharField(max_length=120)
    especie_id = serializers.IntegerField(min_value=1)

class EspeciesQuery(PaginaSerializer):
    busqueda = serializers.CharField(
        required=False, allow_blank=True, max_length=200, default=""
    )

def entrada(schema, data, partial=False):
    s = schema(data=data, partial=partial)
    s.is_valid(raise_exception=True)
    return s.validated_data

class EspeciesView(APIView):
    def get(self, request):
        return Response(
            gestion.buscar_especies(**entrada(EspeciesQuery, request.query_params))
        )

class EspecieView(APIView):
    def get(self, request, id):
        return Response(gestion.ver_especie(id))

class PecesView(APIView):
    def get(self, request):
        return Response(
            gestion.listar_peces(
                request.user.pk, **entrada(PaginaSerializer, request.query_params)
            )
        )

    def post(self, request):
        return Response(
            gestion.registrar_pez(request.user.pk, entrada(PezEntrada, request.data)),
            status=201,
        )

class PezView(APIView):

    def get(self, request, id):
        return Response(gestion.ver_pez(request.user.pk, id))
