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
    desplazamiento = serializers.IntegerField(
        min_value=0, max_value=2_147_483_647, default=0
    )

    def to_internal_value(self, data):
        extras = set(data) - set(self.fields)
        if extras:
            raise serializers.ValidationError(
                {campo: ["Parámetro no permitido."] for campo in sorted(extras)}
            )
        return super().to_internal_value(data)


class BusquedaPublicacionesSerializer(PaginaSerializer):
    tema = serializers.CharField(required=False, allow_blank=False, max_length=200)

    def to_internal_value(self, data):
        if hasattr(data, "getlist") and len(data.getlist("tema")) > 1:
            raise serializers.ValidationError(
                {"tema": ["Envíe un solo tema de búsqueda."]}
            )
        # QueryDict trata un campo opcional vacío como omitido; aquí se distingue
        # expresamente entre listado sin tema y una búsqueda enviada sin texto.
        if (
            "tema" in data
            and isinstance(data.get("tema"), str)
            and not data["tema"].strip()
        ):
            raise serializers.ValidationError(
                {"tema": ["Debe ingresar un tema para buscar."]}
            )
        return super().to_internal_value(data)
