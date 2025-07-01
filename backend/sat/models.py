from django.db import models

# sat/models.py

class UsoCFDI(models.Model):
    clave = models.CharField(max_length=5, primary_key=True)
    descripcion = models.CharField(max_length=255)
    persona_fisica = models.BooleanField(default=False)
    persona_moral = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.clave} - {self.descripcion}"
    
class FormaPago(models.Model):
    clave = models.CharField(max_length=5, primary_key=True)
    descripcion = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.clave} - {self.descripcion}"
    
class MetodoPago(models.Model):
    clave = models.CharField(max_length=5, primary_key=True)
    descripcion = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.clave} - {self.descripcion}"
    
class RegimenFiscal(models.Model):
    clave = models.CharField(max_length=5, primary_key=True)
    descripcion = models.CharField(max_length=255)
    persona_fisica = models.BooleanField(default=False)
    persona_moral = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.clave} - {self.descripcion}"