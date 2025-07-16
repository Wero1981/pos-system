# Paquete/views.py
from rest_framework import viewsets
from .models import Paquete
from .serializers import PaqueteSerializer
# Create your views here

class PaqueteViewSet(viewsets.ModelViewSet):
    queryset = Paquete.objects.all()
    serializer_class = PaqueteSerializer

    def get_queryset(self):
        """
        Optionally restricts the returned packages to a given user,
        by filtering against a `nombre` query parameter in the URL.
        """
        queryset = self.queryset
        nombre = self.request.query_params.get('nombre', None)
        if nombre is not None:
            queryset = queryset.filter(nombre__icontains=nombre)
        return queryset