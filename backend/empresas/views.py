#empresas/views.py
from rest_framework import viewsets, permissions
from empresas.models import Empresa, Sucursal
from empresas.serializers import EmpresaSerializer, SucursalSerializer
from drf_yasg.utils import swagger_auto_schema

class EmpresaViewSet(viewsets.ModelViewSet):
    queryset = Empresa.objects.all()
    serializer_class = EmpresaSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
            Limitar las empresas al usuario autenticado
        """
        usuario = self.request.user
        if usuario.empresa:
            return Empresa.objects.filter(id=usuario.empresa.id)
        

        
        return Empresa.objects.none()


    

    def perform_create(self, serializer):
        """
            Asignar la empresa al usuario autenticado al crear una nueva empresa
        """
        usuario = self.request.user
        empresa = serializer.save()
        usuario.empresa = empresa
        usuario.save()

        Sucursal.objects.create(
            empresa=empresa,
            nombre="Matriz",
        )
    


    @swagger_auto_schema(operation_description="Listar y gestionar empresas")
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)
    
    
class SucursalViewSet(viewsets.ModelViewSet):
    queryset = Sucursal.objects.all()
    serializer_class = SucursalSerializer

    @swagger_auto_schema(operation_description="Listar y gestionar sucursales")
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)