from django.contrib import admin

from sat.models import UsoCFDI, FormaPago, MetodoPago, RegimenFiscal

class UsoCFDIAdmin(admin.ModelAdmin):
    list_display = ('clave', 'descripcion', 'persona_fisica', 'persona_moral')
    search_fields = ('clave', 'descripcion')

class FormaPagoAdmin(admin.ModelAdmin):
    list_display = ('clave', 'descripcion')
    search_fields = ('clave', 'descripcion')

class MetodoPagoAdmin(admin.ModelAdmin):
    list_display = ('clave', 'descripcion')
    search_fields = ('clave', 'descripcion')

class RegimenFiscalAdmin(admin.ModelAdmin):
    list_display = ('clave', 'descripcion', 'persona_fisica', 'persona_moral')
    search_fields = ('clave', 'descripcion')

admin.site.register(UsoCFDI, UsoCFDIAdmin)
admin.site.register(FormaPago, FormaPagoAdmin)
admin.site.register(MetodoPago, MetodoPagoAdmin)
admin.site.register(RegimenFiscal, RegimenFiscalAdmin)