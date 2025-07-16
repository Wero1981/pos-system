#Paquete/models.py
from django.db import models

# Create your models here.

class Paquete(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    descripcion = models.TextField(blank=True, null=True)
    precio_mesual = models.DecimalField(max_digits=10, decimal_places=2)
    precio_anual = models.DecimalField(max_digits=10, decimal_places=2)
    es_gratuito = models.BooleanField(default=False)
    limite_sucursales = models.PositiveIntegerField(default=1)
    limite_usuarios = models.PositiveIntegerField(default=1)
    limite_productos = models.PositiveIntegerField(default=100)
    incluye_soporte = models.BooleanField(default=True)
    activo = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.nombre} {'(Gratis)' if self.es_gratuito else ''}"
