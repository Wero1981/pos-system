from django.contrib import admin

from contabilidad.models import MovimientoContable

class MovimientoContableAdmin(admin.ModelAdmin):
   list_display = ('empresa', 'sucursal', 'tipo_movimiento', 'descripcion', 'monto', 'fecha', 'referencia', 'relacionado_venta')

admin.site.register(MovimientoContable, MovimientoContableAdmin)
# Register your models here.
