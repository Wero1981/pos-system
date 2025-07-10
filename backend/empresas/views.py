#empresas/views.py
from rest_framework import viewsets
from empresas.models import Empresa, Sucursal
from empresas.serializers import EmpresaSerializer, SucursalSerializer
from drf_yasg.utils import swagger_auto_schema

class EmpresaViewSet(viewsets.ModelViewSet):
    queryset = Empresa.objects.all()
    serializer_class = EmpresaSerializer

    @swagger_auto_schema(operation_description="Listar y gestionar emrpesas")
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)
    
class SucursalViewSet(viewsets.ModelViewSet):
    queryset = Sucursal.objects.all()
    serializer_class = SucursalSerializer

    @swagger_auto_schema(operation_description="Listar y gestionar sucursales")
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)