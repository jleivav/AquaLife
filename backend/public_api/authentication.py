from django.conf import settings
from rest_framework.authentication import BasicAuthentication
from rest_framework.exceptions import AuthenticationFailed


class LocalBasicAuthentication(BasicAuthentication):
    """Identidad de pruebas C2, disponible solo en desarrollo y loopback."""

    def authenticate(self, request):
        if not settings.DEBUG or request.META.get("REMOTE_ADDR") not in {
            "127.0.0.1", "::1"
        }:
            raise AuthenticationFailed("La autenticación de pruebas solo está disponible localmente.")
        return super().authenticate(request)
