from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from aggregation import comentarios
from public_api.serializers import CrearComentarioSerializer, PaginaSerializer


class ComentariosView(APIView):
    def post(self, request, publicacion_id):
        entrada = CrearComentarioSerializer(data=request.data)
        entrada.is_valid(raise_exception=True)
        comentario = comentarios.comentar(
            publicacion_id, request.user.pk, entrada.validated_data["contenido"]
        )
        return Response(
            comentario,
            status=status.HTTP_201_CREATED,
            headers={
                "Location": f"/api/v1/publicaciones/{publicacion_id}/comentarios/{comentario['id']}"
            },
        )

    def get(self, request, publicacion_id):
        entrada = PaginaSerializer(data=request.query_params)
        entrada.is_valid(raise_exception=True)
        return Response(comentarios.listar(publicacion_id, **entrada.validated_data))


class ComentarioView(APIView):
    def get(self, request, publicacion_id, comentario_id):
        return Response(comentarios.consultar(publicacion_id, comentario_id))
