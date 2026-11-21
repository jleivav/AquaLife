from django.conf import settings
from django.middleware.csrf import get_token, rotate_token
from django.utils.decorators import method_decorator
from django.views.decorators.cache import never_cache
from django.views.decorators.csrf import csrf_protect
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.settings import api_settings
from domain.usuarios.sesion import renew_refresh, revoke_refresh

COOKIE = "aqualife_refresh"
COOKIE_PATH = "/api/v1/auth/"


def access_response(tokens):
    response = Response({"access": tokens["access"]})
    response.set_cookie(
        COOKIE, tokens["refresh"],
        max_age=int(api_settings.REFRESH_TOKEN_LIFETIME.total_seconds()),
        path=COOKIE_PATH, httponly=True, secure=settings.CSRF_COOKIE_SECURE,
        samesite="Lax",
    )
    return response


@method_decorator(never_cache, name="dispatch")
@method_decorator(csrf_protect, name="dispatch")
class SessionView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]


class CsrfView(SessionView):
    def get(self, request):
        return Response({"csrf": get_token(request)})


class LoginView(SessionView):
    def post(self, request):
        serializer = TokenObtainPairSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        rotate_token(request)
        response = access_response(serializer.validated_data)
        response.data["csrf"] = get_token(request)
        return response

    def get_authenticate_header(self, request):
        return 'Bearer realm="api"'


class RefreshView(SessionView):
    def post(self, request):
        refresh = request.COOKIES.get(COOKIE)
        if not refresh:
            raise InvalidToken("La sesión no está disponible.")
        try:
            tokens = renew_refresh(refresh)
        except TokenError as exc:
            raise InvalidToken("La sesión expiró o ya no es válida.") from exc
        return access_response(tokens)

    def get_authenticate_header(self, request):
        return 'Bearer realm="api"'


class LogoutView(SessionView):
    def post(self, request):
        refresh = request.COOKIES.get(COOKIE)
        if refresh:
            try:
                revoke_refresh(refresh)
            except TokenError:
                pass
        response = Response(status=204)
        response.delete_cookie(COOKIE, path=COOKIE_PATH, samesite="Lax")
        return response
