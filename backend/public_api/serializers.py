from rest_framework import serializers


class CrearPublicacionSerializer(serializers.Serializer):
    # El dominio decide si el texto tiene contenido. Aquí solo se comprueba su tipo.
    contenido = serializers.JSONField(required=True)

    def validate_contenido(self, valor):
        if not isinstance(valor, str):
            raise serializers.ValidationError("El contenido debe ser texto.")
        return valor

    def to_internal_value(self, data):
        if isinstance(data, dict):
            extras = set(data) - {"contenido"}
            if extras:
                raise serializers.ValidationError(
                    {campo: ["Campo no permitido."] for campo in sorted(extras)}
                )
        return super().to_internal_value(data)


class PaginaSerializer(serializers.Serializer):
    limite = serializers.IntegerField(min_value=1, max_value=100, default=20)
    desplazamiento = serializers.IntegerField(min_value=0, max_value=2_147_483_647, default=0)

    def to_internal_value(self, data):
        extras = set(data) - {"limite", "desplazamiento"}
        if extras:
            raise serializers.ValidationError(
                {campo: ["Parámetro no permitido en HU1."] for campo in sorted(extras)}
            )
        return super().to_internal_value(data)
