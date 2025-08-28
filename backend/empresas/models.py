#empresas/models.py
from django.db import models

class Empresa(models.Model):
    TIPO_EMPRESA_CHOICES = [
        ('retail', 'Retail'),
        ('servicios', 'Servicios'),
        ('manufactura', 'Manufactura'),
        ('distribucion', 'Distribución'),
        ('restaurante', 'Restaurante'),
        ('otro', 'Otro'),
    ]
    nombre = models.CharField(max_length=255)
    rfc = models.CharField(max_length=13, unique=True, blank=True, null=True)
    logo = models.ImageField(upload_to='logos_empresas/', blank=True, null=True)
    calle = models.TextField(blank=True, null=True)
    numero_exterior = models.CharField(max_length=10, blank=True, null=True)
    numero_interior = models.CharField(max_length=10, blank=True, null=True)
    colonia = models.CharField(max_length=100, blank=True, null=True)
    codigo_postal = models.CharField(max_length=10, blank=True, null=True)
    ciudad = models.CharField(max_length=100, blank=True, null=True)
    estado = models.CharField(max_length=100, blank=True, null=True)
    pais = models.CharField(max_length=100, default='México')
    telefono = models.CharField(max_length=20, blank=True, null=True)
    correo_electronico = models.EmailField(blank=True, null=True)
    tipo_empresa = models.CharField(max_length=20, choices=TIPO_EMPRESA_CHOICES, default='otro')
    plan = models.ForeignKey('Paquete.Paquete', on_delete=models.SET_NULL, null=True, blank=True, related_name='empresas')
    fecha_registro = models.DateTimeField(auto_now_add=True)
    es_matriz = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.nombre} - ({self.rfc})"
    
    def direccion_completa(self):
        partes = [
            self.calle,
            f"{self.numero_exterior}" if self.numero_exterior else "",
            f"{self.numero_interior}" if self.numero_interior else "",
            self.colonia,
            f"C.P. {self.codigo_postal}" if self.codigo_postal else "",
            self.ciudad,
            self.estado,
            self.pais
        ]
        return ", ".join(filter(None, partes)).strip()
    
    direccion_completa.short_description = "Dirección"
    
class Sucursal(models.Model):
    empresa = models.ForeignKey(Empresa, on_delete=models.CASCADE, related_name='sucursales')
    nombre = models.CharField(max_length=255)
    direccion = models.TextField(blank=True, null=True)
    telefono = models.CharField(max_length=20, blank=True, null=True)
    correo_electronico = models.EmailField(blank=True, null=True)
    fecha_registro = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.nombre} - {self.empresa.nombre}"