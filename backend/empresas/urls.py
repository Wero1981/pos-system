#empresas/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from empresas.views import EmpresaViewSet, SucursalViewSet

router = DefaultRouter()
router.register(r'empresas', EmpresaViewSet, basename='empresa')
router.register(r'sucursales', SucursalViewSet, basename='sucursal')

urlpatterns = [
    path('', include(router.urls)),
]