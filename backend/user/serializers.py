#user/serializers.py
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from .models import CustomerUser
from empresas.models import Empresa, Sucursal

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['username'] = user.username
        token['email'] = user.email

        token['rol'] = user.rol

        return token

class CustomerUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomerUser
        fields = [
            'id', 
            'username', 
            'email',  
            'password',
            'nombre',
            'apellido_paterno',
            'apellido_materno',
            'birthdate',
            'phone_number',
            'rol',
            'empresa',
            'sucursal', 
            'is_active', 
            'fecha_registro'
        ]
        read_only_fields = ['id', 'fecha_registro']

    def validate(self, data):
        """
        Validar que si hay sucursal, pertenezcan a la empresa
        """
        empresa = data.get('empresa')
        sucursal = data.get('sucursal')

        if empresa and sucursal:
            if sucursal.empresa_id != empresa.id:
                raise serializers.ValidationError(
                    "La sucursal debe pertenecer a la empresa seleccionada."
                )
        return data
    
    def create(self, validated_data):
        """
        Crear un nuevo usuario con la contraseña encriptada
        """

        password = validated_data.pop('password')

        if 'rol' not in validated_data:
            validated_data['rol'] = 'vendedor'


        user = CustomerUser(**validated_data)
        user.set_password(password)
        user.save()
        return user
    
class CustomerUserRegisterSerializer(serializers.ModelSerializer):

    username = serializers.CharField(
        max_length=150, 
        validators=[],
        )
    email = serializers.EmailField(
        max_length=254, 
        validators=[],
        )
    password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomerUser
        fields = [
            'id',
            'email',
            'username',
            'password',
        ]
        read_only_fields = ['id']

    def validate_username(self, value):
        """
        Validar que el username no esté en uso
        """
        if CustomerUser.objects.filter(username=value).exists():
            raise serializers.ValidationError("El nombre de usuario ya está en uso.")

        return value

    def validate_email(self, value):
        """
        Validar que el email no esté en uso
        """
        if CustomerUser.objects.filter(email=value).exists():
            raise serializers.ValidationError("El email ya está en uso.")

        return value


    def create(self, validated_data):
        """
        Crear un nuevo usuario para registro al pos
        """

        user = CustomerUser(
            email=validated_data['email'],
            username=validated_data['username'],
        )
        user.set_password(validated_data['password'])
        user.save()
        return user
    
