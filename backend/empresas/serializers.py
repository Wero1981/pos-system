from rest_framework import serializers

from empresas.models import Empresa

class EmpresaSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    nombre = serializers.CharField(max_length=255)
    rfc = serializers.CharField(max_length=13, required=True)
    direccion = serializers.CharField(max_length=500, allow_blank=True, required=False)
    telefono = serializers.CharField(max_length=20, allow_blank=True, required=False)
    correo_electronico = serializers.EmailField(allow_blank=True, required=False)
    fecha_registro = serializers.DateTimeField(read_only=True)

    def create(self, validated_data):
        """
        Create and return a new `Empresa` instance, given the validated data.
        """
        validated_data.pop("id", None)  # Ensure id is not included in creation
        empresa = Empresa.objects.create(**validated_data)
        return empresa
    
    def update(self, instance, validated_data):
        """
        Update and return an existing `Empresa` instance, given the validated data.
        """
        instance.nombre = validated_data.get('nombre', instance.nombre)
        instance.rfc = validated_data.get('rfc', instance.rfc)
        instance.direccion = validated_data.get('direccion', instance.direccion)
        instance.telefono = validated_data.get('telefono', instance.telefono)
        instance.correo_electronico = validated_data.get('correo_electronico', instance.correo_electronico)
        instance.save()
        return instance
    