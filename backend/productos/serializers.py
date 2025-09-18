from rest_framework import serializers
from .models import CategoriaProducto, Producto, MovimientoInventario, InventarioSucursal


# ----------- Categoria Producto -----------
class CategoriaProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = CategoriaProducto
        fields = ["id", "nombre", "descripcion"]


# ----------- Inventario por sucursal -----------
class InventarioSucursalSerializer(serializers.ModelSerializer):
    sucursal_nombre = serializers.CharField(source="sucursal.nombre", read_only=True)

    class Meta:
        model = InventarioSucursal
        fields = ["id", "sucursal", "sucursal_nombre", "stock_actual"]


# ----------- Producto -----------
class ProductoSerializer(serializers.ModelSerializer):
    categoria_nombre = serializers.CharField(source="categoria.nombre", read_only=True)
    inventarios = InventarioSucursalSerializer(many=True, read_only=True)
    imagen_url = serializers.SerializerMethodField()

    class Meta:
        model = Producto
        fields = [
            "id",
            "empresa",
            "nombre",
            "descripcion",
            "codigo_barras",
            "precio_venta",
            "costo",
            "categoria",
            "categoria_nombre",
            "fecha_registro",
            "quien_registro",
            "imagen",
            "imagen_url",
            "inventarios",
        ]

    def get_imagen_url(self, obj):
        request = self.context.get("request")
        if obj.imagen and request:
            return request.build_absolute_uri(obj.imagen.url)
        return None


# ----------- Movimiento Inventario -----------
class MovimientoInventarioSerializer(serializers.ModelSerializer):
    producto_nombre = serializers.CharField(source="inventario.producto.nombre", read_only=True)
    sucursal_nombre = serializers.CharField(source="inventario.sucursal.nombre", read_only=True)

    class Meta:
        model = MovimientoInventario
        fields = [
            "id",
            "inventario",
            "producto_nombre",
            "sucursal_nombre",
            "tipo_movimiento",
            "cantidad",
            "fecha_movimiento",
        ]
