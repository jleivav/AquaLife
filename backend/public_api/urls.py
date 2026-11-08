from django.urls import path

from public_api.foro import PublicacionView, PublicacionesView

urlpatterns = [
    path("publicaciones", PublicacionesView.as_view(), name="publicaciones"),
    path("publicaciones/<int:publicacion_id>", PublicacionView.as_view(), name="publicacion"),
]
