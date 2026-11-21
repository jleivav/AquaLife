from base64 import b64decode

from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import AccessToken


def autenticar(client, credencial):
    username, password = b64decode(credencial.split()[1]).decode().split(":", 1)
    user = authenticate(username=username, password=password)
    assert user is not None
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {AccessToken.for_user(user)}")
