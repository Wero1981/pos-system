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
from django.db.models import Q
from rest_framework.decorators import action
from rest_framework.response import Response

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

    # UPDATE
    def perform_update(self, serializer):
        """
            Al actualizar la categoria, se asigna la sucursal del usuario
            - admin_system no puede actualizar categorias
            - admin_empresa y cotador_empresa actualizan categorias para su empresa
        """
        usuario = self.request.user
        empresa = usuario.empresa

        if usuario.rol in ['admin_empresa', 'cotador_empresa']:
            if serializer.instance.empresa == empresa:
                serializer.save()
            else:
                raise PermissionError("No tienes permiso para actualizar categorias.")
        else:
            raise PermissionError("No tienes permiso para actualizar categorias.")
    
    #ELIMINAR
    def perform_destroy(self, instance):
        """
            Al eliminar la categoria, se asigna la sucursal del usuario
            - admin_system no puede eliminar categorias
            - admin_empresa y cotador_empresa eliminan categorias para su empresa
        """
        usuario = self.request.user
        empresa = usuario.empresa

        if usuario.rol in ['admin_empresa', 'cotador_empresa']:
            if instance.empresa == empresa:
                instance.delete()
            else:
                raise PermissionError("No tienes permiso para eliminar categorias.")
        else:
            raise PermissionError("No tienes permiso para eliminar categorias.")

    # ------------------------------------
    # METODOS ADICIONALES
    # ------------------------------------     
    
    # Obtener subcategorias y conteo de productos
    @action(detail=False, methods=['get'])
    def jerarquia(self, request):
        """
        Obtener categorias organizadas jerárquicamente
        """
        usuario = self.request.user

        categorias_principales = CategoriaProducto.objects.filter(
            empresa=usuario.empresa,
            categoria_padre__isnull=True
        )

        serializer = self.get_serializer(categorias_principales, many=True)
        return Response(serializer.data)
    

    #Solo categorias principales
    @action(detail=False, methods=['get'])
    def principales(self, request):
        """
        Obtener solo categorias principales (sin categoria_padre)
        """
        usuario = self.request.user

        categorias_principales = CategoriaProducto.objects.filter(
            empresa=usuario.empresa,
            categoria_padre__isnull=True
        )

        serializer = self.get_serializer(categorias_principales, many=True)
        return Response(serializer.data)

class ProductoViewSet(viewsets.ModelViewSet):
    serializer_class = ProductoSerializer
    permission_classes = [IsAuthenticated, RolPermission]

    def get_queryset(self):
        usuario = self.request.user
        queryset = None
        print("[DEBUG] mensaje", "Usuario:", usuario.username, "Rol:", usuario.rol)
        print("[DEBUG] categoria_id", self.request.query_params.get('categoria', None))

        if usuario.rol == "admin_system":
            queryset = Producto.objects.all()
        elif usuario.rol in ["admin_empresa", "cotador_empresa", "almacenista"]:
            print("[DEBUG] mensaje", "Filtrando por empresa:", usuario.empresa)
            queryset = Producto.objects.filter(empresa=usuario.empresa)
        elif usuario.sucursal:
            queryset = Producto.objects.filter(
                inventarios__sucursal=usuario.sucursal
            ).distinct()
        else:
            queryset = Producto.objects.none()
        
        # AGREGAR: Filtros por parámetros

        categoria = self.request.query_params.get('categoria', None)
        print("[DEBUG] Buscar por categoria:", categoria)
        search = self.request.query_params.get('search', None)

        if categoria and categoria != 'todas':
            print("[DEBUG] Filtrando por categoria:", categoria )
            queryset = queryset.filter(categoria=categoria)
            
        if search:
            print("[DEBUG] Filtrando por search:", search)
            queryset = queryset.filter(
                Q(nombre__icontains=search) |
                Q(descripcion__icontains=search) |
                Q(codigo_barras__icontains=search)
            ) 
        
        return queryset.select_related('categoria', 'empresa').order_by('nombre')

    #  AGREGAR: Endpoint específico para buscar
    @action(detail=False, methods=['get'])
    def buscar(self, request):
        """
        Endpoint para búsqueda avanzada de productos
        Parámetros: categoria, search, limit
        """
        categoria_id = request.query_params.get('categoria', None)
        search = request.query_params.get('search', None)
        limit = request.query_params.get('limit', None)
        
        queryset = self.filter_queryset(self.get_queryset())
        
        if categoria_id and categoria_id != 'todas':
            queryset = queryset.filter(categoria_id=categoria_id)
            
        if search:
            queryset = queryset.filter(
                Q(nombre__icontains=search) |
                Q(descripcion__icontains=search) |
                Q(codigo_barras__icontains=search)
            )
        
        if limit:
            queryset = queryset[:int(limit)]
            
        serializer = self.get_serializer(queryset, many=True)
        return Response({
            'results': serializer.data,
            'count': queryset.count()
        })

    #  AGREGAR: Endpoint para productos por categoría
    @action(detail=False, methods=['get'])
    def por_categoria(self, request):
        """
        Obtener productos por categoría específica
        """
        categoria_id = request.query_params.get('categoria_id')
        if not categoria_id:
            return Response({'error': 'categoria_id es requerido'}, status=400)
            
        queryset = self.filter_queryset(self.get_queryset())
        
        if categoria_id == 'todas':
            # Todos los productos
            productos = queryset
        else:
            # Productos de categoría específica
            productos = queryset.filter(categoria_id=categoria_id)
            
        serializer = self.get_serializer(productos, many=True)
        return Response(serializer.data)


    def perform_create(self, serializer):
        """
        Al crear el producto:
        - Se guarda a la empresa del usuario
        - se crean inventarios vacíos (stock=0) en todas las sucursales de la empresa
        """
        usuario = self.request.user
        empresa = usuario.empresa
        print("[DEBUG] imprimir lo que se va a guardar:", serializer.validated_data)

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