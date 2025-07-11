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
        ('cliente', 'Cliente'),
        ('proveedor', 'Proveedor'),
        ('otro', 'Otro'),
    )

    birthdate = models.DateField(blank=True, null=True)
    phone_number = models.CharField(max_length=15, blank=True, null=True)

    #campos adicionales
    rol = models.CharField(max_length=50, choices=ROLES)
    empresa = models.ForeignKey('empresas.Empresa', on_delete=models.CASCADE, null=True, blank=True)
    sucursal = models.ForeignKey('empresas.Sucursal', on_delete=models.CASCADE, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    fecha_registro = models.DateTimeField(auto_now_add=True)
    nombre = models.CharField(max_length=150, blank=True, null=True)
    apellido_paterno = models.CharField(max_length=150, blank=True, null=True)
    apellido_materno = models.CharField(max_length=150, blank=True, null=True)

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']
    
    def __str__(self):
        return self.username  # or any other field you prefer to represent the user