from rest_framework import viewsets, permissions, mixins
from .models import CustomerUser
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from .serializers import CustomTokenObtainPairSerializer, CustomerUserSerializer, CustomerUserRegisterSerializer

class CustomTokenObtainPairView(TokenObtainPairView):
    """
    View para obtener el token JWT personalizado.
    Utiliza el CustomTokenObtainPairSerializer para agregar información adicional al token.
    """

    serializer_class = CustomTokenObtainPairSerializer

class CustomerUserViewSet(viewsets.ModelViewSet):
    """
    ViewSet para manejar los usuarios del sistema.
    Permite listar, crear, actualizar y eliminar usuarios.
    Solo los administradores pueden ver todos los usuarios.
    Los usuarios normales solo pueden ver y actualizar su propio perfil.
    """

    @action(detail=False, methods=['get'], url_path='perfil')
    def perfil(self, request):
        """
        Endpoint para obtener el perfil del usuario autenticado.
        """
        user = request.user
        serializer = self.get_serializer(user)
        return Response(serializer.data)


    queryset = CustomerUser.objects.all()
    serializer_class = CustomerUserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.is_superuser:
            return CustomerUser.objects.all()
        return CustomerUser.objects.filter(id=user.id)
    
    def perform_update(self, serializer):
        """
        Asegurar que no se cambien datos de otro usuario
        """

        user = self.request.user
        if not user.is_staff and not user.is_superuser:
            serializer.save(id=user.id)
        else:
            serializer.save()

class CustomerUserRegisterViewSet(mixins.CreateModelMixin, viewsets.GenericViewSet):
    """
    ViewSet para registrar nuevos usuarios.
    Utiliza el CustomerUserRegisterSerializer para validar y crear usuarios.
    """
    queryset = CustomerUser.objects.all()
    serializer_class = CustomerUserRegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        # Validar datos

        if serializer.is_valid():
            user = serializer.save()
            return Response(
                {
                    "success": True,
                    "message": "Usuario creado correctamente",
                    "user":
                    {
                        'id': user.id,
                        'username': user.username,
                        'email':user.email
                    }
                },
                status = status.HTTP_201_CREATED
            )
        
        return Response(
            {
                "success": False,
                "errors": serializer.errors
            },
            status = status.HTTP_400_BAD_REQUEST
        )

    @action(detail=False, methods=['post'], url_path='check-username')
    def check_username(self, request):
        """
        Endpoint para verificar si un nombre de usuario ya está en uso.
        """
        username = request.data.get('username')
        if not username:
            return Response(
                {"success": False, "error": "El nombre de usuario es requerido."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        exists = CustomerUser.objects.filter(username=username).exists()
        return Response(
            {"success": True, "exists": exists},
            status=status.HTTP_200_OK
        )

    @action(detail=False, methods=['post'], url_path='check-email')
    def check_email(self, request):
        """
        Endpoint para verificar si un email ya está en uso.
        """
        email = request.data.get('email')
        if not email:
            return Response(
                {"success": False, "error": "El email es requerido."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        exists = CustomerUser.objects.filter(email=email).exists()
        return Response(
            {"success": True, "exists": exists},
            status=status.HTTP_200_OK
        )

