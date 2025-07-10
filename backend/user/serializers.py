from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from .models import CustomerUser

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['username'] = user.username
        token['email'] = user.email
        token['nombre_completo'] = user.nombre_completo
        token['rol'] = user.rol

        return token

class CustomerUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerUser
        fields = [
            'id', 'username', 'email', 'nombre_completo', 'rol',
            'birthdate', 'phone_number', 'empresa', 'activo', 'fecha_registro'
        ]
        read_only_fields = ['id', 'fecha_registro']