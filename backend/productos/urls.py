from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CategoriaProductoViewSet,
    ProductoViewSet,
    MovimientoInventarioViewSet
)

router = DefaultRouter()
router.register(r'categorias', CategoriaProductoViewSet, basename='categorias')
router.register(r'productos', ProductoViewSet, basename='productos')
router.register(r'inventario', MovimientoInventarioViewSet, basename='inventario')

urlpatterns = [
    path('', include(router.urls)),
]
