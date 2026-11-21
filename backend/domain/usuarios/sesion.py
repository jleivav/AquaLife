from django.db import transaction
from rest_framework_simplejwt.serializers import TokenRefreshSerializer
from rest_framework_simplejwt.settings import api_settings
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken
from rest_framework_simplejwt.tokens import RefreshToken


def lock_refresh(raw_token):
    token = RefreshToken(raw_token)
    jti = token[api_settings.JTI_CLAIM]
    # Volver a validar después del bloqueo impide reutilizar un refresh rotado en paralelo.
    OutstandingToken.objects.select_for_update().filter(jti=jti).first()
    return RefreshToken(raw_token)


@transaction.atomic
def renew_refresh(raw_token):
    lock_refresh(raw_token)
    serializer = TokenRefreshSerializer(data={"refresh": raw_token})
    serializer.is_valid(raise_exception=True)
    return serializer.validated_data


@transaction.atomic
def revoke_refresh(raw_token):
    lock_refresh(raw_token).blacklist()
