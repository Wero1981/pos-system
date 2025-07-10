from django.contrib import admin

from facturacion.models import Cliente, Factura

class ClienteAdmin(admin.ModelAdmin):
    list_display = (
            'nombre_completo', 
            'rfc', 
            'empresa_registradora', 
            'empresa_facturadora', 
            'Sucursal',
            'correo', 
            'telefono', 
            'fecha_registro'
            )
    search_fields = ('nombre_completo', 'rfc', 'correo')

class FacturaAdmin(admin.ModelAdmin):
    list_display = ('venta', 'cliente', 'uso_cfdi', 'forma_pago', 'metodo_pago', 'regimen_fiscal_receptor', 'tipo_comprobante', 'fecha_emision', 'estatus')
    search_fields = ('venta__id', 'cliente', 'uuid')

admin.site.register(Cliente, ClienteAdmin)
admin.site.register(Factura, FacturaAdmin)