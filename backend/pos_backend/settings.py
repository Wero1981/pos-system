"""
Django settings for pos_backend project.
"""

from pathlib import Path
import os

# ------------------------------
# Paths base
# ------------------------------
BASE_DIR = Path(__file__).resolve().parent.parent

# ------------------------------
# Seguridad
# ------------------------------
SECRET_KEY = "django-insecure-0lh(tvf66*tfm58dhpmd1rl4syr%3p$oz_%nz#*^fymseo*wth"
DEBUG = True
ALLOWED_HOSTS = []

# ------------------------------
# Aplicaciones instaladas
# ------------------------------
INSTALLED_APPS = [
    # Django default
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "django.contrib.sites",

    # REST
    "rest_framework",
    "rest_framework.authtoken",
    "drf_yasg",

    # Apps del proyecto
    "contabilidad",
    "empresas",
    "facturacion",
    "ia",
    "productos",
    "usuarios",
    "ventas",
    "sat",
    "user",
    "Paquete",
    "corsheaders",

    # Allauth
    "allauth",
    "allauth.account",
    "allauth.socialaccount",

    # Proveedores sociales
    "allauth.socialaccount.providers.google",
    "allauth.socialaccount.providers.facebook",

    # dj-rest-auth
    "dj_rest_auth",
    "dj_rest_auth.registration",
]

SITE_ID = 1

# ------------------------------
# Middleware
# ------------------------------
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "allauth.account.middleware.AccountMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "pos_backend.urls"

# ------------------------------
# Templates
# ------------------------------
TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "pos_backend.wsgi.application"

# ------------------------------
# Base de datos
# ------------------------------
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}

# ------------------------------
# Autenticación y contraseñas
# ------------------------------
AUTH_USER_MODEL = "user.CustomerUser"

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

AUTHENTICATION_BACKENDS = [
    "django.contrib.auth.backends.ModelBackend",
    "allauth.account.auth_backends.AuthenticationBackend",
]

# ------------------------------
# REST Framework
# ------------------------------
REST_FRAMEWORK = {
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticated",
    ],
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ],
}

# ------------------------------
# JWT para dj-rest-auth
# ------------------------------
REST_USE_JWT = True
DJ_REST_AUTH = {
    "USE_JWT": True,
    "JWT_AUTH_COOKIE": "access-token",
    "JWT_AUTH_REFRESH_COOKIE": "refresh-token",
}

# ------------------------------
# dj-rest-auth - custom serializer de registro
# ------------------------------
REST_AUTH_REGISTER_SERIALIZERS = {
    "REGISTER_SERIALIZER": "user.serializers.CustomRegisterSerializer",
}

# ------------------------------
# Allauth - configuración básica y login social
# ------------------------------
ACCOUNT_SIGNUP_FIELDS = {
    "username": {"required": True},
    "email": {"required": True},
    "password1": {"required": True},
    "password2": {"required": True},
}

ACCOUNT_EMAIL_VERIFICATION = "optional"
ACCOUNT_LOGIN_METHODS = ["username", "email"]

SOCIALACCOUNT_PROVIDERS = {
    "google": {
        "SCOPE": ["profile", "email"],
    },
    "facebook": {
        "METHOD": "oauth2",
        "SCOPE": ["email"],
        "AUTH_PARAMS": {"auth_type": "reauthenticate"},
        "FIELDS": ["id", "email", "name", "first_name", "last_name", "verified"],
        "VERSION": "v12.0",
    },
}

# ------------------------------
# Login / Logout
# ------------------------------
LOGIN_REDIRECT_URL = "/"
LOGOUT_REDIRECT_URL = "/"

# ------------------------------
# CORS
# ------------------------------
CORS_ALLOW_ALL_ORIGINS = True  # solo para desarrollo

# ------------------------------
# Internationalización
# ------------------------------
#lenguaje mexicano es "es-mx"
LANGUAGE_CODE = "es-mx"
TIME_ZONE = "America/Mexico_City"
USE_I18N = True
USE_TZ = True

# ------------------------------
# Static y Media
# ------------------------------
STATIC_URL = "static/"
MEDIA_URL = "/media/"
MEDIA_ROOT = os.path.join(BASE_DIR, "media")

# ------------------------------
# Default primary key field
# ------------------------------
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# ------------------------------
# Swagger
# ------------------------------
SWAGGER_SETTINGS = {
    "SECURITY_DEFINITIONS": {
        "api_key": {"type": "apiKey", "in": "header", "name": "Authorization"}
    }
}

# ------------------------------
# Email backend (para pruebas)
# ------------------------------
EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"
