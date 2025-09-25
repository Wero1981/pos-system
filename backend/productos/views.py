from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import CategoriaProducto, Producto, MovimientoInventario, InventarioSucursal
from empresas.models import Sucursal
from user.permissions import RolPermission
from .serializers import (
    CategoriaProductoSerializer,
    ProductoSerializer,
    MovimientoInventarioSerializer,
    InventarioSucursalSerializer,
)

class CategoriaProductoViewSet(viewsets.ModelViewSet):
    serializer_class = CategoriaProductoSerializer
    permission_classes = [IsAuthenticated, RolPermission]

    def get_queryset(self):
        """
            -  todos pueden ver las categorias de la empresa
        """

        usuario = self.request.user
        return CategoriaProducto.objects.filter(empresa=usuario.empresa)

    def perform_create(self, serializer):
        """
            Al crear la categoria, se asigna la sucursal del usuario
            - admin_system no puede crear categorias
            - admin_empresa y cotador_empresa crean categorias para su empresa
        """
        usuario = self.request.user
        empresa = usuario.empresa

        if usuario.rol in ['admin_empresa', 'cotador_empresa']:
            serializer.save(empresa=empresa)
        else:
            raise PermissionError("No tienes permiso para crear categorias.")
        
    

class ProductoViewSet(viewsets.ModelViewSet):
    serializer_class = ProductoSerializer
    permission_classes = [IsAuthenticated, RolPermission]

    def get_queryset(self):
        usuario = self.request.user
        if usuario.rol == "admin_system":
            return Producto.objects.all()
        elif usuario.rol in ["admin_empresa", "cotador_empresa", "almacenista"]:
            return Producto.objects.filter(empresa=usuario.empresa)
        elif usuario.sucursal:
            # CORREGIR: filtrar a través del inventario, no directamente por sucursal
            return Producto.objects.filter(
                inventarios__sucursal=usuario.sucursal
            ).distinct()
        return Producto.objects.none()

    def perform_create(self, serializer):
        """
        Al crear el producto:
        - Se guarda a la empresa del usuario
        - se crean inventarios vacíos (stock=0) en todas las sucursales de la empresa
        """
        usuario = self.request.user
        empresa = usuario.empresa
        
        # Asignar empresa automáticamente al producto
        producto = serializer.save(empresa=empresa, quien_registro=usuario.username)

        # Crear inventarios vacíos en todas las sucursales de la empresa
        sucursales = Sucursal.objects.filter(empresa=empresa)
        inventarios = [
            InventarioSucursal(producto=producto, sucursal=sucursal, stock_actual=0)  # Cambiar 'stock' por 'stock_actual'
            for sucursal in sucursales
        ]
        InventarioSucursal.objects.bulk_create(inventarios)


class MovimientoInventarioViewSet(viewsets.ModelViewSet):
    serializer_class = MovimientoInventarioSerializer
    permission_classes = [RolPermission]

    def get_queryset(self):
        usuario = self.request.user
        if usuario.rol in ['admin_system']:
            return MovimientoInventario.objects.all()
        elif usuario.rol in ['admin_empresa', 'cotador_empresa']:
            # CORREGIR: filtrar a través del inventario
            return MovimientoInventario.objects.filter(
                inventario__sucursal__empresa=usuario.empresa
            )
        elif usuario.rol in ['admin_sucursal', 'almacenista', 'vendedor', 'cajero', 'mesero', 'cotador_sucursal', 'supervisor']:
            # CORREGIR: filtrar a través del inventario
            return MovimientoInventario.objects.filter(
                inventario__sucursal=usuario.sucursal
            )
        return MovimientoInventario.objects.none()
    

    def perform_create(self, serializer):  # CAMBIAR: 'perfom_create' por 'perform_create'
        """
        Al crear un movimiento de inventario, se actualiza el stock.
        """
        usuario = self.request.user
        # El inventario debe especificarse en los datos, no asumir la sucursal
        movimiento = serializer.save()

        inventario = movimiento.inventario
        if movimiento.tipo_movimiento == 'entrada':
            inventario.stock_actual += movimiento.cantidad
        elif movimiento.tipo_movimiento == 'salida':
            inventario.stock_actual -= movimiento.cantidad
        elif movimiento.tipo_movimiento == 'ajuste':
            inventario.stock_actual = movimiento.cantidad

        inventario.save()

# ----------- Inventario por sucursal -----------
class InventarioSucursalViewSet(viewsets.ModelViewSet):
    serializer_class = InventarioSucursalSerializer
    permission_classes = [IsAuthenticated, RolPermission]

    def get_queryset(self):
        """
            filtrar inventario segun el rol:
            -admin_system ve todo el inventario
            -admin_empresa y cotador_empresa ven el inventario de su empresa
            -admin_sucursal, almacenista, vendedor, cajero, mesero, cotador_sucursal, supervisor
             ven solo el inventario de su sucursal
        """
        usuario = self.request.user
        queryset = InventarioSucursal.objects.all()

        if usuario.rol == "admin_system":
            return InventarioSucursal.objects.all()
        elif usuario.rol in ["admin_empresa", "cotador_empresa"]:
            return InventarioSucursal.objects.filter(sucursal__empresa=usuario.empresa)
        elif usuario.rol in ["admin_sucursal", "almacenista", "vendedor", "cajero", "mesero", "cotador_sucursal", "supervisor"]:
            return InventarioSucursal.objects.filter(sucursal=usuario.sucursal)
        return InventarioSucursal.objects.none()