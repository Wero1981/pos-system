#empresas/admin.py
from django.contrib import admin

from empresas.models import Empresa, Sucursal

class EmpresaAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'rfc', 'direccion_completa', 'telefono', 'correo_electronico', 'fecha_registro')
    search_fields = ('nombre', 'rfc')

class SucursalAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'empresa', 'direccion', 'telefono', 'correo_electronico', 'fecha_registro')
    search_fields = ('nombre', 'empresa__nombre')

admin.site.register(Empresa, EmpresaAdmin)
admin.site.register(Sucursal, SucursalAdmin)