from rest_framework import viewsets, permissions, mixins
from .models import CustomerUser
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.decorators import action
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


