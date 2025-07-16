from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PaqueteViewSet

router = DefaultRouter()
router.register(r'paquetes', PaqueteViewSet, basename='paquete')
urlpatterns = [
    path('', include(router.urls)),
]