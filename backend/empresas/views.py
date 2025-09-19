#empresas/views.py
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from empresas.models import Empresa, Sucursal
from empresas.serializers import EmpresaSerializer, SucursalSerializer
from drf_yasg.utils import swagger_auto_schema
from user.permissions import RolPermission

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
        #1 validar y guardar la empresa
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        empresa = serializer.save()

        # 2 Asignar la empresa al usuario
        usuario = request.user
        usuario.empresa = empresa
        usuario.save()

        # 3 Crear la sucursal matriz
        sucursal_matriz = Sucursal.objects.create(
            empresa=empresa,
            nombre="Matriz",
        )
        response_data = {}
        response_data['empresa'] = {
            'id': empresa.id,
            'nombre': empresa.nombre,
            'tipo_empresa': empresa.get_tipo_empresa_display()
        }
        sucursales = usuario.empresa.sucursales.all()
        if sucursales.exists():
            response_data['sucursales']=[
                {
                    'id': sucursal.id,
                    'nombre': sucursal.nombre
                } for sucursal in sucursales
            ]

        else:
            response_data['sucursales'] = []
        response_data['empresa_configurada'] = True
        return Response(response_data, status=status.HTTP_201_CREATED)

    @swagger_auto_schema(operation_description="Listar y gestionar empresas")
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)
    
    
class SucursalViewSet(viewsets.ModelViewSet):
    serializer_class = SucursalSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
            filtrar sucursales segun el rol:
            -admin_system ve todas las sucursales
            -admin_empresa y cotador_empresa ven las sucursales de su empresa
            -admin_sucursal, almacenista, vendedor, cajero, mesero, cotador_sucursal, supervisor
             ven solo su sucursal
        """
        usuario = self.request.user
        rol = usuario.rol
        print("[DEBUG_PYTHON] rol usuario:", rol)
        if usuario.rol == "admin_system":
            return Sucursal.objects.all()
        elif usuario.rol in ["admin_empresa", "cotador_empresa"]:
            return Sucursal.objects.filter(empresa=usuario.empresa)
        elif usuario.sucursal:
            return Sucursal.objects.filter(id=usuario.sucursal.id)
        return Sucursal.objects.none()  

    @swagger_auto_schema(operation_description="Listar y gestionar sucursales")
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)