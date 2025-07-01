# ventas/models.py
from django.db import models
from empresas.models import Empresa, Sucursal
from usuarios.models import Usuario
from productos.models import Producto

# Create your models here.
class Venta(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    empresa = models.ForeignKey(Empresa, on_delete=models.CASCADE)
    sucursal = models.ForeignKey(Sucursal, on_delete=models.CASCADE)
    fecha_venta = models.DateTimeField(auto_now_add=True)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    metodo_pago = models.CharField(max_length=50, choices=[
        ('efectivo', 'Efectivo'),
        ('tarjeta', 'Tarjeta'),
        ('transferencia', 'Transferencia'),
        ('otro', 'Otro')
    ])
    cliente_nombre = models.CharField(max_length=255, blank=True, null=True)
    cliente_rfc = models.CharField(max_length=13, blank=True, null=True)
    estatus = models.CharField(max_length=20, choices=[
        ('completada', 'Completada'),
        ('cancelada', 'Cancelada'),
    ], default='completada')
    sucursal = models.ForeignKey(Sucursal, on_delete=models.CASCADE)

    def __str__(self):
        return f"Venta #{self.id} - {self.total}"
    
class DetalleVenta(models.Model):
    venta = models.ForeignKey(Venta, related_name='detalles', on_delete=models.CASCADE)
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    cantidad = models.PositiveIntegerField()
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)

    def save(self, *args, **kwargs):
        self.subtotal = self.cantidad * self.precio_unitario
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.producto.nombre} x{self.cantidad}"