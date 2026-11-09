from django.urls import path

from public_api.foro import PublicacionView, PublicacionesView

urlpatterns = [
    path("publicaciones", PublicacionesView.as_view(), name="publicaciones"),
    path("publicaciones/<int:publicacion_id>", PublicacionView.as_view(), name="publicacion"),
]

from public_api import peces as p
urlpatterns += [
    path("especies", p.EspeciesView.as_view()),
    path("especies/<int:id>", p.EspecieView.as_view()),
    path("peces", p.PecesView.as_view()),
    path("peces/<int:id>", p.PezEdicionView.as_view()),
]

from public_api import ranking as r
urlpatterns += [
    path("peceras", r.PecerasView.as_view()),
    path("categorias", r.CategoriasView.as_view()),
    path("inscripciones", r.InscripcionesView.as_view()),
    path("ranking", r.RankingView.as_view()),
]

urlpatterns += [path("inscripciones/<int:id>/votos", r.VotosView.as_view())]
