from rest_framework.generics import CreateAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Usuario
from .serializers import (
    RegistroUsuarioSerializer,
    UsuarioSerializer,
    PerfilCandidatoSerializer,
    PerfilReclutadorSerializer
)

# 📝 Registro combinado: Usuario + perfil según el rol
class RegistroUsuarioView(CreateAPIView):
    queryset = Usuario.objects.all()
    serializer_class = RegistroUsuarioSerializer

# 🔐 Devolver los datos del usuario autenticado + perfil
class MiPerfilView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        user_data = UsuarioSerializer(user).data

        if user.rol == 'candidato' and hasattr(user, 'perfil_candidato'):
            perfil_data = PerfilCandidatoSerializer(user.perfil_candidato).data
        elif user.rol == 'reclutador' and hasattr(user, 'perfil_reclutador'):
            perfil_data = PerfilReclutadorSerializer(user.perfil_reclutador).data
        else:
            perfil_data = {}

        return Response({
            'usuario': user_data,
            'perfil': perfil_data
        })