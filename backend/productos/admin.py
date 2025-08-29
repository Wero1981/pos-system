from django.contrib import admin

from productos.models import CategoriaProducto, Producto, MovimientoInventario

class CategoriaProductoAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'descripcion')
    search_fields = ('nombre', 'descripcion')

class ProductoAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'codigo_barras', 'precio_venta', 'costo', 'stock_actual', 'categoria', 'sucursal', 'fecha_registro')
    search_fields = ('nombre', 'codigo_barras', 'sucursal__nombre')
    list_filter = ('categoria', 'sucursal')

class MovimientoInventarioAdmin(admin.ModelAdmin):
    list_display = ('producto', 'tipo_movimiento', 'cantidad', 'motivo', 'fecha')
    search_fields = ('producto__nombre', 'tipo_movimiento', 'motivo')
    list_filter = ('tipo_movimiento', 'fecha')

admin.site.register(CategoriaProducto, CategoriaProductoAdmin)
admin.site.register(Producto, ProductoAdmin)
admin.site.register(MovimientoInventario, MovimientoInventarioAdmin)