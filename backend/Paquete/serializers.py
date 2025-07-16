from rest_framework import serializers  
from .models import Paquete

class PaqueteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Paquete
        fields = '__all__'
        read_only_fields = ('id', 'activo')  # Assuming 'id' and 'activo' should not be writable