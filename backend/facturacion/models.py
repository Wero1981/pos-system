# facturacion/models.py
from django.db import models
from ventas.models import Venta
from empresas.models import Empresa, Sucursal

class Cliente(models.Model):
    #Empresa que registr el cliente
    empresa_registradora = models.ForeignKey(
        'empresas.Empresa', on_delete=models.CASCADE, related_name='clientes_registrados'
    )

    #EMpresa con la que factura el cliente
    empresa_facturadora = models.ForeignKey(
        'empresas.Empresa', on_delete=models.CASCADE, related_name='clientes_facturados'
    )

    #Sucursal
    Sucursal = models.ForeignKey(
        'empresas.Sucursal',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='clientes'
    )

    nombre_completo = models.CharField(max_length=255)
    rfc = models.CharField(max_length=13, unique=True)
    direccion = models.TextField(blank=True, null=True)
    correo = models.EmailField(blank=True, null=True)
    telefono = models.CharField(max_length=20, blank=True, null=True)
    fecha_registro = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.nombre_completo

class Factura(models.Model):
    venta = models.OneToOneField(Venta, on_delete=models.CASCADE)
    cliente = models.ForeignKey(Cliente, on_delete=models.SET_NULL, null=True)
    
    # Datos fiscales obligatorios SAT
    uso_cfdi = models.CharField(max_length=5)
    forma_pago = models.CharField(max_length=5)
    metodo_pago = models.CharField(max_length=5)
    regimen_fiscal_receptor = models.CharField(max_length=5)
    tipo_comprobante = models.CharField(max_length=1, default='I')  # I = Ingreso

    # Timbre y sellos
    uuid = models.CharField(max_length=100, unique=True)
    sello_digital = models.TextField(blank=True, null=True)
    cadena_original = models.TextField(blank=True, null=True)

    # Archivos
    archivo_xml = models.FileField(upload_to='facturas/xml/', blank=True, null=True)
    archivo_pdf = models.FileField(upload_to='facturas/pdf/', blank=True, null=True)

    # Metadatos
    fecha_emision = models.DateTimeField(auto_now_add=True)
    estatus = models.CharField(max_length=20, default='emitida')  # cancelada, pendiente

    def __str__(self):
        return f"CFDI {self.uuid}"