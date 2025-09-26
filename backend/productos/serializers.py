from rest_framework import serializers
from .models import CategoriaProducto, Producto, MovimientoInventario, InventarioSucursal


# ----------- Categoria Producto -----------
class CategoriaProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = CategoriaProducto
        fields = ["id", "nombre", "descripcion"]


# ----------- Inventario por sucursal -----------
class InventarioSucursalSerializer(serializers.ModelSerializer):
    producto_nombre = serializers.CharField(source="producto.nombre", read_only=True)
    producto_codigo = serializers.CharField(source="producto.codigo_barras", read_only=True)
    sucursal_nombre = serializers.CharField(source="sucursal.nombre", read_only=True)

    class Meta:
        model = InventarioSucursal
        fields = [
            "id", 
            "sucursal", 
            "sucursal_nombre", 
            "producto", 
            "producto_nombre", 
            "producto_codigo",
            "stock_actual"
            ]


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

        read_only_fields = ["empresa", "fecha_registro", "quien_registro", "inventarios"]

    def get_imagen_url(self, obj):
        request = self.context.get("request")
        if obj.imagen and request:
            return request.build_absolute_uri(obj.imagen.url)
        return None

    def create(self, validated_data):
        # Lógica para crear un nuevo producto
        return super().create(validated_data)


# ----------- Movimiento Inventario -----------
class MovimientoInventarioSerializer(serializers.ModelSerializer):
    producto_nombre = serializers.CharField(source="inventario.producto.nombre", read_only=True)
    sucursal_nombre = serializers.CharField(source="inventario.sucursal.nombre", read_only=True)
    sucursal_id = serializers.CharField(source="inventario.sucursal.id", read_only=True)

    class Meta:
        model = MovimientoInventario
        fields = [
            "id",
            "inventario",
            "producto_nombre",
            "sucursal_nombre",
            "sucursal_id",
            "tipo_movimiento",
            "cantidad",
            "fecha_movimiento",
        ]
