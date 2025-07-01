"""
URL configuration for pos_backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path, include
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

schema_view = get_schema_view(
    openapi.Info(
        title="POS System API",
        default_version='v1',
        description="API documentation for the POS System",
        terms_of_service="https://www.google.com/policies/terms/",
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)


urlpatterns = [
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path("admin/", admin.site.urls),
    path("contabilidad/", include("contabilidad.urls")),
    path("empresas/", include("empresas.urls")),
    path("facturacion/", include("facturacion.urls")),
    path("ia/", include("ia.urls")),
    path("productos/", include("productos.urls")),
    path("usuarios/", include("usuarios.urls")),
    path("ventas/", include("ventas.urls")),
    path("sat/", include("sat.urls"))
]
