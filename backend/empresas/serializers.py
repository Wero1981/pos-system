#empresas/serializaer.py

from rest_framework import serializers
from empresas.models import Empresa, Sucursal

class EmpresaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Empresa
        fields = [
            'id',
            'nombre',
            'rfc',
            'calle',
            'numero_exterior',
            'numero_interior',
            'colonia',
            'codigo_postal',
            'ciudad',
            'estado',
            'pais',
            'telefono',
            'correo_electronico',
            'tipo_empresa',
            'fecha_registro'
        ]
        read_only_fields = ['fecha_registro']

class SucursalSerializer(serializers.ModelSerializer):
    empresa = serializers.StringRelatedField()
    class Meta:
        model = Sucursal
        fields = [
            'id',
            'empresa',
            'nombre',
            'direccion',
            'telefono',
            'correo_electronico',
            'fecha_registro'
        ]
        read_only_fields = ['fecha_registro']