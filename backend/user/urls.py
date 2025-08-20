# user/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CustomerUserViewSet, CustomTokenObtainPairView, CustomerUserRegisterViewSet
from rest_framework_simplejwt.views import TokenRefreshView

router = DefaultRouter()
router.register(r'usuarios', CustomerUserViewSet, basename='customeruser')
router.register(r'registro', CustomerUserRegisterViewSet, basename='customeruserregister')

urlpatterns = [
    path('', include(router.urls)),
    path("token/", CustomTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),

    #enpoints de social login google facebook
    path("auth/", include("dj_rest_auth.urls")),
    path("auth/registration/", include("dj_rest_auth.registration.urls")),

]

