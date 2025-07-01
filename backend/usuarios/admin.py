from django.contrib import admin

from usuarios.models import Usuario

class UsuarioAdmin(admin.ModelAdmin):
    list_display = ('nombre_completo', 'correo_electronico', 'rol', 'empresa', 'activo', 'fecha_registro')
    search_fields = ('nombre_completo', 'correo_electronico', 'rol')
    list_filter = ('rol', 'empresa', 'activo')

admin.site.register(Usuario, UsuarioAdmin)
