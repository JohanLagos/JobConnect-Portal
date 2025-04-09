from django.urls import path, include
from .views import RegistroUsuarioView, MiPerfilView


urlpatterns = [
    path('registro/', RegistroUsuarioView.as_view(), name='registro'),
    path('perfil-usuario/', MiPerfilView.as_view(), name='mi-perfil'),
]