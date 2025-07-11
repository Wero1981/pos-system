#productos/serializers.py
from rest_framework import serializers
from .models import Producto, Categoria

class ProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields = [
            'id', 'nombre', 'descripcion', 'codigo_barras',
            'precio_venta', 'costo', 'stock_actual', 'categoria',
            'empresa', 'fecha_registro', 'quien_registro'
        ]
        read_only_fields = ('fecha_registro', 'quien_registro')

class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = ['id', 'nombre', 'descripcion']
        read_only_fields = ('id',)
        