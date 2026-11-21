from django.urls import include, path

from public_api.session import CsrfView, LoginView, LogoutView, RefreshView

urlpatterns = [
    path("api/v1/auth/csrf", CsrfView.as_view()),
    path("api/v1/auth/login", LoginView.as_view()),
    path("api/v1/auth/refresh", RefreshView.as_view()),
    path("api/v1/auth/logout", LogoutView.as_view()),
    path("api/v1/", include("public_api.urls")),
]
