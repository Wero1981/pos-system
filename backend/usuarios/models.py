#usuarios/models.py
from django.db import models
from empresas.models import Empresa, Sucursal

class Usuario(models.Model):
    ROLES = (
        ('admin', 'Administrador'),
        ('vendedor', 'Vendedor'),
        ('cotador', 'Cotador'),
        ('supervisor', 'Supervisor'),
        ('almacenista', 'Almacenista'),
    )
    nombre_completo = models.CharField(max_length=255)
    correo_electronico = models.EmailField(unique=True)
    contrasena = models.CharField(max_length=128)
    rol = models.CharField(max_length=50, choices=ROLES)
    empresa = models.ForeignKey(Empresa, on_delete=models.CASCADE)
    activo = models.BooleanField(default=True)
    fecha_registro = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.nombre_completo
# Create your models here.
