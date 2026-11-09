from decimal import Decimal
from rest_framework import serializers
from rest_framework.views import APIView
from rest_framework.response import Response
from aggregation import ranking as gestion
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

class PeceraEntrada(Entrada):
    nombre = serializers.CharField(max_length=120)
    litros = serializers.DecimalField(
        max_digits=9,
        decimal_places=2,
        min_value=Decimal("0.01"),
        required=False,
        allow_null=True,
    )
    categoria_id = serializers.IntegerField(
        min_value=1, required=False, allow_null=True
    )

class InscripcionEntrada(Entrada):
    pecera_id = serializers.IntegerField(min_value=1)

class RankingQuery(Entrada):
    categoria = serializers.IntegerField(min_value=1)

def entrada(schema, data, partial=False):
    s = schema(data=data, partial=partial)
    s.is_valid(raise_exception=True)
    return s.validated_data

class PecerasView(APIView):
    def get(self, request):
        return Response(
            gestion.listar_peceras(
                request.user.pk, **entrada(PaginaSerializer, request.query_params)
            )
        )

    def post(self, request):
        return Response(
            gestion.crear_pecera(request.user.pk, entrada(PeceraEntrada, request.data)),
            status=201,
        )

class CategoriasView(APIView):
    def get(self, request):
        return Response({"resultados": gestion.categorias()})

class InscripcionesView(APIView):
    def post(self, request):
        return Response(
            gestion.inscribir(
                request.user.pk, **entrada(InscripcionEntrada, request.data)
            ),
            status=201,
        )

class RankingView(APIView):
    def get(self, request):
        return Response(
            gestion.ver_ranking(**entrada(RankingQuery, request.query_params))
        )
