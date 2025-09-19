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
        """
            filtrar productos segun el rol:
            -admin_system ve todos los productos
            -admin_empresa y cotador_empresa ven los productos de su empresa
            -admin_sucursal, almacenista, vendedor, cajero, mesero, cotador_sucursal, supervisor
             ven solo los productos de su sucursal
        """
        usuario = self.request.user
        if usuario.rol == "admin_system":
            return Producto.objects.all()
        elif usuario.rol in ["admin_empresa", "cotador_empresa"]:
            return Producto.objects.filter(sucursal__empresa=usuario.empresa)
        elif usuario.sucursal:
            return Producto.objects.filter(sucursal=usuario.sucursal)
        return Producto.objects.none()

    def perform_create(self, serializer):
        """
            Al crear el producto:
            - Se guarda a la empresa del usuario
            - se crean inventarios vacios (stock= 0) en todas las sucursales de la empresa
        """

        usuario = self.request.user
        empresa = usuario.empresa
        producto = serializer.save(empresa=empresa, quien_registro=usuario.username)

        # Crear inventarios vacíos en todas las sucursales de la empresa
        sucursales = Sucursal.objects.filter(empresa=empresa)
        inventarios = [
            InventarioSucursal(producto=producto, sucursal=sucursal, stock=0)
            for sucursal in sucursales
        ]
        InventarioSucursal.objects.bulk_create(inventarios)


class MovimientoInventarioViewSet(viewsets.ModelViewSet):
    serializer_class = MovimientoInventarioSerializer
    permission_classes = [RolPermission]

    def get_queryset(self):
        """
        Filtra los movimientos de inventario según la sucursal del usuario.
        - admin_system ve todos los movimientos
        - admin_empresa y cotador_empresa ven los movimientos de su empresa
        - admin_sucursal, almacenista, vendedor, cajero, mesero, cotador_sucursal, supervisor
          ven solo los movimientos de su sucursal
        """
        usuario = self.request.user
        if usuario.rol in ['admin_system']:
            return MovimientoInventario.objects.all()
        elif usuario.rol in ['admin_empresa', 'cotador_empresa']:
            return MovimientoInventario.objects.filter(sucursal__empresa=usuario.empresa)
        elif usuario.rol in ['admin_sucursal', 'almacenista', 'vendedor', 'cajero', 'mesero', 'cotador_sucursal', 'supervisor']:
            return MovimientoInventario.objects.filter(sucursal=usuario.sucursal)
        return MovimientoInventario.objects.none()
    
    def perfom_create(self, serializer):
        """
        Al crear un movimiento de inventario, se actualiza el stock en el inventario de la sucursal correspondiente.
        """
        
        usuario = self.request.user
        sucursal = usuario.sucursal
        movimiento = serializer.save(sucursal=sucursal)

        inventario = InventarioSucursal.objects.get(sucursal=sucursal, producto=movimiento.producto)

        if movimiento.tipo_movimiento == 'entrada':
            inventario.stock_actual += movimiento.cantidad
        elif movimiento.tipo_movimiento == 'salida':
            inventario.stock_actual -= movimiento.cantidad
        elif movimiento.tipo_movimiento == 'ajuste':
            inventario.stock_actual = movimiento.cantidad  # Ajuste directo al valor especificado

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