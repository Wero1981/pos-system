from rest_framework import viewsets, permissions, mixins, generics
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from drf_yasg.utils import swagger_auto_schema

from .models import CustomerUser
from .serializers import (
    CustomTokenObtainPairSerializer,
    CustomerUserSerializer
)

# ------------------------------
# Login con JWT
# ------------------------------
class CustomTokenObtainPairView(TokenObtainPairView):
    """
    View para obtener el token JWT personalizado.
    """
    serializer_class = CustomTokenObtainPairSerializer

# ------------------------------
# ViewSet para usuarios
# ------------------------------
class CustomerUserViewSet(viewsets.ModelViewSet):
    """
    ViewSet para manejar usuarios del sistema.
    - Admin: puede ver todos los usuarios.
    - Usuario normal: solo puede ver y actualizar su propio perfil.
    """
    queryset = CustomerUser.objects.all()
    serializer_class = CustomerUserSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['get'], url_path='perfil')
    def perfil(self, request):
        """
        Endpoint para obtener el perfil del usuario autenticado.
        """
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.is_superuser:
            return CustomerUser.objects.all()
        return CustomerUser.objects.filter(id=user.id)

    def perform_update(self, serializer):
        # Asegurar que usuarios normales solo actualicen su propio perfil
        user = self.request.user
        if not user.is_staff and not user.is_superuser:
            serializer.save()
        else:
            serializer.save()
        
    #************************************
    #* 
    #* Check Username
    #*
    #*************************************/

    @action(detail=False, methods=['post'], url_path='check-username', permission_classes=[])
    def check_username(self, request):
        username = request.data.get("username")
        if CustomerUser.objects.filter(username=username).exists():
            return Response({"exists": True}, status=status.HTTP_200_OK)
        return Response({"exists": False}, status=status.HTTP_200_OK)


    #************************************
    #* Check Email
    #*
    #*************************************/

    @action(detail=False, methods=['post'], url_path='check-email', permission_classes=[])
    def check_email(self, request):
        email = request.data.get("email")
        if CustomerUser.objects.filter(email=email).exists():
            return Response({"exists": True}, status=status.HTTP_200_OK)
        return Response({"exists": False}, status=status.HTTP_200_OK)


# ------------------------------
# Registro vía dj-rest-auth usando CustomRegisterSerializer
# ------------------------------
# NOTA: Ahora usamos dj-rest-auth registration, no necesitamos crear un endpoint extra
# Solo asegurarse que REST_AUTH_REGISTER_SERIALIZERS apunte a CustomRegisterSerializer

# ------------------------------
# Vista para actualizar el usuario autenticado
# ------------------------------
class UserUpdateView(generics.UpdateAPIView):
    """
    Actualizar datos del usuario autenticado
    """
    queryset = CustomerUser.objects.all()
    serializer_class = CustomerUserSerializer
    permission_classes = [permissions.IsAuthenticated]

    @swagger_auto_schema(operation_description="Obtener el usuario autenticado")
    def get_object(self):
        return self.request.user
