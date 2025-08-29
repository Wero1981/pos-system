from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from .views import CustomerUserViewSet, CustomTokenObtainPairView, UserUpdateView

router = DefaultRouter()
router.register(r'usuarios', CustomerUserViewSet, basename='customeruser')

urlpatterns = [
    # CRUD de usuarios
    path('', include(router.urls)),

    # Perfil / actualización de usuario autenticado
    path("me/", UserUpdateView.as_view(), name="user_update"),

    # JWT
    path("token/", CustomTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),

    # Endpoints de registro, login, social login
    path("auth/", include("dj_rest_auth.urls")),
    path("auth/registration/", include("dj_rest_auth.registration.urls")),
    path("auth/social/", include("allauth.socialaccount.urls")),
]
