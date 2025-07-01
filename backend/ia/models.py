# ia/models.py
from django.db import models
from usuarios.models import Usuario
from empresas.models import Empresa

class HistorialEventoIA(models.Model):
    tipo_evento = models.CharField(max_length=100)
    datos_json = models.JSONField()
    fecha_evento = models.DateTimeField(auto_now_add=True)
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    empresa = models.ForeignKey(Empresa, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.tipo_evento} - {self.fecha_evento}"

class Recomendacion(models.Model):
    tipo = models.CharField(max_length=100)
    descripcion = models.TextField()
    datos_json = models.JSONField()
    fecha_generada = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Recomendación: {self.tipo}"
