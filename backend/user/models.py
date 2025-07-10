from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class CustomerUser(AbstractUser):
    """
    Usuario personalizado del sistema.
    """
    ROLES = (
        ('admin', 'Administrador'),
        ('vendedor', 'Vendedor'),
        ('cotador', 'Cotador'),
        ('supervisor', 'Supervisor'),
        ('almacenista', 'Almacenista'),
        ('mesero', 'Mesero'),
        ('cajero', 'Cajero'),
    )

    birthdate = models.DateField(blank=True, null=True)
    phone_number = models.CharField(max_length=15, blank=True, null=True)

    #campos adicionales
    nombre_completo = models.CharField(max_length=255)
    correo_electronico = models.EmailField(unique=True)
    contrasena = models.CharField(max_length=128)
    rol = models.CharField(max_length=50, choices=ROLES)
    empresa = models.ForeignKey('empresas.Empresa', on_delete=models.CASCADE, null=True, blank=True)
    activo = models.BooleanField(default=True)
    fecha_registro = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.username  # or any other field you prefer to represent the user