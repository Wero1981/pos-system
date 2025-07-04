from django.urls import path
from empresas.views import get_empresa, update_empresa
app_name = 'empresas'

urlpatterns = [
    path("", get_empresa, name='get_empresa'),
    path("<int:pk>/", update_empresa, name='update_empresa'),
]