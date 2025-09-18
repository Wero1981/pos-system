#empresas/views.py
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
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
            - ROL admin_empresa: puede ver crear/modificar su empresa
            - ROL admin_sucursal: puede ver su empresa
        """
        usuario = self.request.user
        if usuario.empresa:
            return Empresa.objects.filter(id=usuario.empresa.id)

        return Empresa.objects.none()

    def create(self, request, *args, **kwargs):
        """
            Crear una sucursal matriz al crear una empresa
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        empresa = serializer.save()

        # Asignamos empresa  al usuario
        usuario = request.user
        usuario.empresa = empresa
        usuario.save()

        sucursal_matriz = Sucursal.objects.create(
            empresa=empresa,
            nombre="Matriz",
        )
        sucursal_matriz.save()

        # Retornamos la id_empresa creada id_sucursal, nombre_empresa, tipo_empresa
        headers = self.get_success_headers(serializer.data)
        return Response({
            'empresa': {
                'id': empresa.id,
                'nombre': empresa.nombre,
                'tipo_empresa': empresa.tipo_empresa,
            },
            'sucursal': {
                'id': sucursal_matriz.id,
                'nombre': sucursal_matriz.nombre,
            }
           
        }, status=status.HTTP_201_CREATED)

    @swagger_auto_schema(operation_description="Listar y gestionar empresas")
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)
    
    
class SucursalViewSet(viewsets.ModelViewSet):
    queryset = Sucursal.objects.all()
    serializer_class = SucursalSerializer

    @swagger_auto_schema(operation_description="Listar y gestionar sucursales")
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)