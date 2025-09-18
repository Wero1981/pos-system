from django.contrib import admin
from .models import CategoriaProducto, Producto, MovimientoInventario, InventarioSucursal

class CategoriaProductoAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'descripcion')  # Quitamos 'sucursal'
    search_fields = ('nombre', 'descripcion')
    # list_filter = ('sucursal',)  # Eliminamos también

class ProductoAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'codigo_barras', 'precio_venta', 'costo', 'categoria', 'empresa', 'fecha_registro')
    search_fields = ('nombre', 'codigo_barras')
    list_filter = ('categoria', 'empresa', 'fecha_registro')

class InventarioSucursalAdmin(admin.ModelAdmin):
    list_display = ('producto', 'sucursal', 'stock_actual')
    search_fields = ('producto__nombre', 'sucursal__nombre')
    list_filter = ('sucursal',)

class MovimientoInventarioAdmin(admin.ModelAdmin):
    list_display = ('get_producto', 'get_sucursal', 'tipo_movimiento', 'cantidad', 'fecha_movimiento')
    search_fields = ('inventario__producto__nombre', 'tipo_movimiento')
    list_filter = ('tipo_movimiento', 'fecha_movimiento')
    
    def get_producto(self, obj):
        return obj.inventario.producto.nombre
    get_producto.short_description = 'Producto'
    
    def get_sucursal(self, obj):
        return obj.inventario.sucursal.nombre
    get_sucursal.short_description = 'Sucursal'

# Registramos los modelos
admin.site.register(CategoriaProducto, CategoriaProductoAdmin)
admin.site.register(Producto, ProductoAdmin)
admin.site.register(InventarioSucursal, InventarioSucursalAdmin)
admin.site.register(MovimientoInventario, MovimientoInventarioAdmin)
