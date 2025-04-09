from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets, permissions
from .models import Vacante
from .serializers import VacanteSerializer

# Create your views here.
class VacanteViewSet(viewsets.ModelViewSet):
    serializer_class = VacanteSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        user = self.request.user
        # Si está autenticado y es reclutador, solo sus vacantes
        if user.is_authenticated and user.rol == 'reclutador':
            return Vacante.objects.filter(reclutador=user).order_by('-fecha_publicacion')
        # Si es candidato o no autenticado, puede ver todo
        return Vacante.objects.all().order_by('-fecha_publicacion')
    
    def perform_create(self, serializer):
        user = self.request.user
        if user.rol != 'reclutador':
            raise permissions.PermissionDenied("Solo los reclutadores pueden crear vacantes.")
        serializer.save(reclutador=user)
    
