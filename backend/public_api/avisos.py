from rest_framework import serializers
from rest_framework.views import APIView
from rest_framework.response import Response
from aggregation import avisos as gestion
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

class PreferenciasEntrada(Entrada):
    respuestas = serializers.BooleanField(required=False)
    ranking = serializers.BooleanField(required=False)

    def validate(self, attrs):
        if not attrs:
            raise serializers.ValidationError("Seleccione alguna preferencia.")
        if any(type(self.initial_data[k]) is not bool for k in attrs):
            raise serializers.ValidationError(
                "Las preferencias deben ser booleanos JSON."
            )
        return attrs

def entrada(schema, data, partial=False):
    s = schema(data=data, partial=partial)
    s.is_valid(raise_exception=True)
    return s.validated_data

class PreferenciasView(APIView):
    def get(self, request):
        return Response(gestion.preferencias(request.user.pk))

    def patch(self, request):
        return Response(
            gestion.guardar_preferencias(
                request.user.pk, entrada(PreferenciasEntrada, request.data)
            )
        )

class NotificacionesView(APIView):
    def get(self, request):
        return Response(
            gestion.notificaciones(
                request.user.pk, **entrada(PaginaSerializer, request.query_params)
            )
        )
