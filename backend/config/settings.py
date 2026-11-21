"""Configuración de desarrollo C2. No contiene secretos compartidos."""
import json
import os
from datetime import timedelta
from pathlib import Path

from django.core.exceptions import ImproperlyConfigured

BASE_DIR = Path(__file__).resolve().parent.parent
LOCAL_CONFIG = BASE_DIR.parent / ".aqualife-backend.local"
local = json.loads(LOCAL_CONFIG.read_text(encoding="utf-8")) if LOCAL_CONFIG.exists() else {}


def value(name, default=None):
    result = os.environ.get(name, local.get(name, default))
    if result is None or result == "":
        raise ImproperlyConfigured(
            f"Falta {name}. Preparar .aqualife-backend.local o la variable de entorno."
        )
    return result


SECRET_KEY = value("DJANGO_SECRET_KEY")
DEBUG = str(value("DJANGO_DEBUG", "false")).lower() == "true"
ALLOWED_HOSTS = ["127.0.0.1", "localhost", "[::1]"]
INSTALLED_APPS = [
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "rest_framework",
    "rest_framework_simplejwt.token_blacklist",
    "domain.foro.apps.ForoConfig",
    "domain.peces",
    "domain.ranking",
    "domain.avisos",
]
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]
ROOT_URLCONF = "config.urls"
WSGI_APPLICATION = "config.wsgi.application"
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": value("DB_NAME", "aqualife"),
        "USER": value("DB_USER", "aqualife_dev"),
        "PASSWORD": value("DB_PASSWORD"),
        "HOST": value("DB_HOST", "127.0.0.1"),
        "PORT": value("DB_PORT", "5432"),
        "OPTIONS": {"connect_timeout": 5},
    }
}
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": ["rest_framework_simplejwt.authentication.JWTAuthentication"],
    "DEFAULT_PERMISSION_CLASSES": ["rest_framework.permissions.IsAuthenticated"],
    "DEFAULT_PARSER_CLASSES": ["rest_framework.parsers.JSONParser"],
    "DEFAULT_RENDERER_CLASSES": ["rest_framework.renderers.JSONRenderer"],
    "EXCEPTION_HANDLER": "public_api.errors.exception_handler",
}
CSRF_COOKIE_SECURE = not DEBUG
CSRF_TRUSTED_ORIGINS = ["http://127.0.0.1:5173"] if DEBUG else []
SIMPLE_JWT = {
    "SIGNING_KEY": value("JWT_SIGNING_KEY"),
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=5),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=1),
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,
}
LANGUAGE_CODE = "es-cl"
TIME_ZONE = "America/Santiago"
USE_I18N = True
USE_TZ = True
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
APPEND_SLASH = False
DATA_UPLOAD_MAX_MEMORY_SIZE = 1_048_576
