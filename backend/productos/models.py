from django.db import models
from empresas.models import Sucursal, Empresa

class CategoriaProducto(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    descripcion = models.TextField(blank=True, null=True)

    class Meta:
        verbose_name = "Categoria de Productos"
        verbose_name_plural = "Categorias de Productos"
        ordering = ['nombre']

    def __str__(self):
        return f"{self.nombre} - {self.sucursal.nombre}"

class Producto(models.Model):
    empresa = models.ForeignKey(Empresa, on_delete=models.CASCADE, related_name='productos')
    nombre = models.CharField(max_length=255)
    descripcion = models.TextField(blank=True, null=True)
    codigo_barras = models.CharField(max_length=50, unique=True, blank=True, null=True)
    precio_venta = models.DecimalField(max_digits=10, decimal_places=2)
    costo = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    categoria = models.ForeignKey(CategoriaProducto, on_delete=models.SET_NULL, null=True, blank=True)
    fecha_registro = models.DateTimeField(auto_now_add=True)
    quien_registro = models.CharField(max_length=100, blank=True, null=True)  # Usuario que registró el producto
    imagen = models.ImageField(upload_to='productos/', blank=True, null=True)   

    def __str__(self):
        return f"{self.nombre} ({self.codigo_barras})"
    
class InventarioSucursal(models.Model):
    sucursal = models.ForeignKey(Sucursal, on_delete=models.CASCADE, related_name='inventarios')
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE, related_name='inventarios')
    stock_actual = models.IntegerField(default=0)

    class Meta:
        unique_together = ('sucursal', 'producto')

    def __str__(self):
        return f"{self.producto.nombre} en {self.sucursal.nombre}: {self.stock_actual}"

class MovimientoInventario(models.Model):
    TIPOS = (
        ('entrada', 'Entrada'),
        ('salida', 'Salida'),
        ('ajuste', 'Ajuste'),
    )
    inventario = models.ForeignKey(InventarioSucursal, on_delete=models.CASCADE)
    tipo_movimiento = models.CharField(max_length=10, choices=TIPOS)
    cantidad = models.IntegerField()
    fecha_movimiento = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return (
            f"{self.get_tipo_movimiento_display()} "
            f"{self.cantidad} de {self.inventario.producto.nombre} "
            f"({self.inventario.sucursal.nombre})"
        )
