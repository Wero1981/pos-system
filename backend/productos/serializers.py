from rest_framework import serializers
from .models import CategoriaProducto, Producto, MovimientoInventario

class CategoriaProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = CategoriaProducto
        fields = '__all__'


class ProductoSerializer(serializers.ModelSerializer):
    categoria = CategoriaProductoSerializer(read_only=True)
    categoria_id = serializers.PrimaryKeyRelatedField(
        queryset=CategoriaProducto.objects.all(),
        source='categoria',
        write_only=True
    )

    class Meta:
        model = Producto
        fields = '__all__'


class MovimientoInventarioSerializer(serializers.ModelSerializer):
    producto = ProductoSerializer(read_only=True)
    producto_id = serializers.PrimaryKeyRelatedField(
        queryset=Producto.objects.all(),
        source='producto',
        write_only=True
    )

    class Meta:
        model = MovimientoInventario
        fields = ['id', 
                  'tipo_movimiento', 
                  'cantidad', 
                  'motivo', 
                  'fecha', 
                  'producto', 
                  'producto_id', 
                  'sucursal']
        read_only_fields = ['id', 'fecha']
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        request = self.context.get('request')
        if request and hasattr(request.user, 'sucursal'):
            self.fields['producto_id'].queryset = Producto.objects.filter(sucursal=request.user.sucursal)

    def validate_cantidad(self, value):
        if value <= 0:
            raise serializers.ValidationError("La cantidad debe ser mayor que cero.")
        return value

    def validate(self, data):
        producto = data.get('producto')
        sucursal = data.get('sucursal')

        if producto and sucursal and producto.sucursal_id != sucursal.id:
            raise serializers.ValidationError("El producto no pertenece a la sucursal especificada.")
        return data
