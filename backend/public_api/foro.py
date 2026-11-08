from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from aggregation import foro
from public_api.serializers import (
    CrearPublicacionSerializer,
    BusquedaPublicacionesSerializer,
)


class PublicacionesView(APIView):
    def post(self, request):
        entrada = CrearPublicacionSerializer(data=request.data)
        entrada.is_valid(raise_exception=True)
        publicacion = foro.publicar(
            request.user.pk, entrada.validated_data["contenido"]
        )
        return Response(
            publicacion,
            status=status.HTTP_201_CREATED,
            headers={"Location": f"/api/v1/publicaciones/{publicacion['id']}"},
        )

    def get(self, request):
        entrada = BusquedaPublicacionesSerializer(data=request.query_params)
        entrada.is_valid(raise_exception=True)
        return Response(foro.listar(**entrada.validated_data))


class PublicacionView(APIView):
    def get(self, request, publicacion_id):
        return Response(foro.consultar(publicacion_id))
