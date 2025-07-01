from django.db import models

# contabilidad/models.py
from django.db import models
from empresas.models import Empresa, Sucursal
from ventas.models import Venta

class MovimientoContable(models.Model):
    TIPO = (
        ('ingreso', 'Ingreso'),
        ('egreso', 'Egreso'),
    )
    empresa = models.ForeignKey(Empresa, on_delete=models.CASCADE)
    sucursal = models.ForeignKey(Sucursal, on_delete=models.SET_NULL, null=True, blank=True)
    tipo_movimiento = models.CharField(max_length=50, choices=TIPO)
    descripcion = models.TextField()
    monto = models.DecimalField(max_digits=10, decimal_places=2)
    fecha = models.DateTimeField(auto_now_add=True)
    referencia = models.CharField(max_length=100, blank=True, null=True)
    relacionado_venta = models.ForeignKey(Venta, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return f"{self.tipo_movimiento} - {self.monto}"
