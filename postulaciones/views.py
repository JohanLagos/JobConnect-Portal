from rest_framework import viewsets, permissions, serializers, generics
from .models import Postulacion
from .serializers import PostulacionSerializer

# Create your views here.
class PostulacionViewSet(viewsets.ModelViewSet):
    serializer_class = PostulacionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.rol == 'reclutador':
            return Postulacion.objects.filter(vacante__reclutador=user)
        elif user.rol == 'candidato':
            return Postulacion.objects.filter(candidato=user)
        return Postulacion.objects.none()

    def perform_create(self, serializer):
        user = self.request.user
        if user.rol != 'candidato':
            raise permissions.PermissionDenied("Solo los candidatos pueden postularse.")
        
        vacante_id = self.request.data.get('vacante')
        if Postulacion.objects.filter(candidato=user, vacante_id=vacante_id).exists():
            raise serializers.ValidationError("Ya te postulaste a esta vacante.")
        
        serializer.save(candidato=user)

class PostulacionesDeMisVacantesView(generics.ListAPIView):
    serializer_class = PostulacionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.rol != 'reclutador':
            return Postulacion.objects.none()
        return Postulacion.objects.filter(vacante__reclutador=user).select_related("candidato", "vacante")

class PostulacionesPorVacanteView(generics.ListAPIView):
    serializer_class = PostulacionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        vacante_id = self.request.query_params.get('vacante')

        if user.rol != 'reclutador':
            return Postulacion.objects.none()

        return Postulacion.objects.filter(vacante__id=vacante_id, vacante__reclutador=user).select_related("candidato")

class MisPostulacionesView(generics.ListAPIView):
    serializer_class = PostulacionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.rol != 'candidato':
            return Postulacion.objects.none()
        return Postulacion.objects.filter(candidato=user).select_related("vacante")
