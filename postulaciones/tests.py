from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from .models import Postulacion, Vacante
from .serializers import PostulacionSerializer

User = get_user_model()

class PostulacionViewSetTest(TestCase):
    def setUp(self):
        self.client = APIClient()

        # Crear usuarios
        self.candidato = User.objects.create_user(username='candidato1', password='testpass', rol='candidato')
        self.reclutador = User.objects.create_user(username='reclutador1', password='testpass', rol='reclutador')

        # Crear vacante
        self.vacante = Vacante.objects.create(titulo="Backend Dev", reclutador=self.reclutador)

    def test_candidato_puede_postularse(self):
        self.client.force_authenticate(user=self.candidato)

        response = self.client.post('/postulaciones/', {'vacante': self.vacante.id})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Postulacion.objects.count(), 1)
        self.assertEqual(Postulacion.objects.first().candidato, self.candidato)

    def test_candidato_no_puede_postularse_dos_veces(self):
        Postulacion.objects.create(candidato=self.candidato, vacante=self.vacante)
        self.client.force_authenticate(user=self.candidato)

        response = self.client.post('/postulaciones/', {'vacante': self.vacante.id})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("Ya te postulaste", str(response.data))

    def test_reclutador_no_puede_postularse(self):
        self.client.force_authenticate(user=self.reclutador)

        response = self.client.post('/postulaciones/', {'vacante': self.vacante.id})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_get_queryset_para_reclutador(self):
        postulacion = Postulacion.objects.create(candidato=self.candidato, vacante=self.vacante)
        self.client.force_authenticate(user=self.reclutador)

        response = self.client.get('/postulaciones/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_get_queryset_para_candidato(self):
        postulacion = Postulacion.objects.create(candidato=self.candidato, vacante=self.vacante)
        self.client.force_authenticate(user=self.candidato)

        response = self.client.get('/postulaciones/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
