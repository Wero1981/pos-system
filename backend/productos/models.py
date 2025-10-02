from django.db import models
from empresas.models import Sucursal, Empresa

class CategoriaProducto(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True, null=True)
    empresa = models.ForeignKey(Empresa, on_delete=models.CASCADE, related_name='categorias')

    # Soporte para multiples niveles de categorias

    categoria_padre = models.ForeignKey(
        'self',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='subcategorias',
    )

    # NUEVO: Campo para controlar profundidad
    nivel = models.PositiveIntegerField(default=0, help_text="0=Principal, 1=Subcategoría, 2=Sub-subcategoría, etc.")

    class Meta:
        verbose_name = "Categoria de Productos"
        verbose_name_plural = "Categorias de Productos"
        ordering = ['nivel', 'categoria_padre__nombre', 'nombre']
        unique_together = ('nombre', 'empresa', 'categoria_padre')  # El nombre debe ser único por empresa

    def save(self, *args, **kwargs):
        # AUTO-CALCULAR el nivel basado en la jerarquía
        if self.categoria_padre:
            self.nivel = self.categoria_padre.nivel + 1
        else:
            self.nivel = 0

        super().save(*args, **kwargs)

    def __str__(self):
        return self.get_path()

    #--------------------------------------
    # METODOS UTILES
    #--------------------------------------
    
    def get_path(self):
        """ Retorna la ruta completa de la categoría, e.g., 'Ropa > Hombre > Camisas' """
        categorias = []
        categoria = self
        while categoria:
            categorias.append(categoria.nombre)
            categoria = categoria.categoria_padre
        return " > ".join(reversed(categorias))

    def get_all_subcategorias(self):
        """ Retorna todas las subcategorías recursivamente """
        subcategorias = list(self.subcategorias.all())
        for sub in list(subcategorias):
            subcategorias.extend(sub.get_all_subcategorias())
        return subcategorias
    
    def get_root_categoria(self):
        """ Retorna la categoría raíz (nivel 0) """
        categoria = self
        while categoria.categoria_padre:
            categoria = categoria.categoria_padre
        return categoria
    
    @property
    def es_hoja(self):
        """ Retorna True si la categoría no tiene subcategorías """
        return not self.subcategorias.exists()
    
    @property
    def profundidad_maxima(self):
        """ Retorna la profundidad máxima de la jerarquía desde esta categoría """
        if self.es_hoja:
            return self.nivel
        else:
            return max(sub.profundidad_maxima for sub in self.subcategorias.all())
    
        


class Producto(models.Model):
    #Opciones de unidada de medida
    UNIDAD_PZA =  'PZA'
    UNIDAD_PESO = 'PESO'
    UNIDAD_LITRO = 'LITRO'

    UNIDAD_OPCIONES = [
        (UNIDAD_PZA, 'Pieza / Unidad'),
        (UNIDAD_PESO, 'Peso (e.g.,  Kg, gr, lb, oz)'),
        (UNIDAD_LITRO, 'Litros (e.g., Lt, ml)'),
    ]
    empresa = models.ForeignKey(Empresa, on_delete=models.CASCADE, related_name='productos')
    nombre = models.CharField(max_length=255)
    descripcion = models.TextField(blank=True, null=True)
    codigo_barras = models.CharField(max_length=50, unique=True, blank=True, null=True)
    precio_venta = models.DecimalField(max_digits=10, decimal_places=2)
    costo = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    categoria = models.ForeignKey(CategoriaProducto, on_delete=models.SET_NULL, null=True, blank=True)
    fecha_registro = models.DateTimeField(auto_now_add=True)
    quien_registro = models.CharField(max_length=100, blank=True, null=True)  # Usuario que registró el producto
    imagen_url = models.URLField(max_length=500, blank=True, null=True)

    unidad_medida = models.CharField(
        max_length=10, 
        choices=UNIDAD_OPCIONES, 
        default=UNIDAD_PZA,
        verbose_name="Unidad de Medida"
        )
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
