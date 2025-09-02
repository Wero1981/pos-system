from dj_rest_auth.registration.serializers import RegisterSerializer
from rest_framework import serializers
from .models import CustomerUser
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from allauth.account.adapter import get_adapter
from allauth.account.utils import setup_user_email
from rest_framework import serializers
from django.utils.translation import gettext as _
from django.contrib.auth.password_validation import validate_password
from .models import CustomerUser

# ------------------------------
# Serializer para JWT personalizado
# ------------------------------
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Serializer para obtener el token JWT personalizado.
    """
    def validate(self, attrs):
        data = super().validate(attrs)

        # Verificar si el usuario tiene una empresa
        empresa = getattr(self.user, 'empresa', None)
        if empresa:
            data['empresa_configurada'] = True
            data['empresa'] = {
                'id': empresa.id,
                'nombre': empresa.nombre,
            }
        else:
            data['empresa_configurada'] = False
            data['empresa'] = None
        # Agregar info adicional al payload del token

        return data

# ------------------------------
# Serializer para listar/actualizar usuarios
# ------------------------------
class CustomerUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerUser
        fields = [
            'id', 'username', 'email', 'rol', 'empresa_id', 'sucursal_id', 'is_active', 'is_staff'
        ]
        read_only_fields = ['id', 'is_staff']

# ------------------------------
# Serializer para registro con campos extra
# ------------------------------
class CustomRegisterSerializer(RegisterSerializer):
    username = serializers.CharField(required=True)
    email = serializers.EmailField(required=True)
    password1 = serializers.CharField(write_only=True, required=True)
    password2 = serializers.CharField(write_only=True, required=True)
    empresa_id = serializers.IntegerField(required=True)
    sucursal_id = serializers.IntegerField(required=False)
    rol = serializers.CharField(required=True)

    class Meta:
        model = CustomerUser
        fields = [
            'username', 'email', 'password1', 'password2', 'empresa_id', 'sucursal_id', 'rol'
        ]

    def validate(self, data):
        """
        Validar que las contraseñas coincidan y cumplan con las políticas de seguridad.
        """
        if data['password1'] != data['password2']:
            raise serializers.ValidationError({"password": ["aaaaaLas contraseñas no coinciden."]})
        validate_password(data['password1'], user=CustomerUser(**data))
        
        try:
            validate_password(data['password1'], user=CustomerUser(**data))
        except serializers.ValidationError as e:
            errors = [str(msg) for msg in e]
            raise serializers.ValidationError({"password": errors})

        return data
    
    def create(self, validated_data):
        user = CustomerUser(
            username=validated_data['username'],
            email=validated_data['email'],
            empresa_id=validated_data['empresa_id'],
            sucursal_id=validated_data.get('sucursal_id', None),
            rol=validated_data['rol']
        )
        user.set_password(validated_data['password1'])
        user.save()
        return user

    def get_cleaned_data(self):
        """
        Devuelve los datos limpios para crear el usuario.
        """
        data = super().get_cleaned_data()
        data['empresa_id'] = self.validated_data.get('empresa_id', None)
        data['sucursal_id'] = self.validated_data.get('sucursal_id', None)
        data['rol'] = self.validated_data.get('rol', '')
        return data
