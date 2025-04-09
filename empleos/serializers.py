from rest_framework import serializers
from .models import Vacante

class VacanteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vacante
        fields = '__all__'
        read_only_fields = ['reclutador', 'fecha_publicacion']
        extra_kwargs = {
            'titulo': {'required': True},
            'descripcion': {'required': True},
            'requisitos': {'required': True},
            'ubicacion': {'required': False},
            'tipo_contrato': {'required': False}
        }