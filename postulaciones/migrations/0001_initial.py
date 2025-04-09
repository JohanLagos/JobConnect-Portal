# Generated by Django 5.2 on 2025-04-08 22:56

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('empleos', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Postulacion',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('fecha_postulacion', models.DateTimeField(auto_now_add=True)),
                ('estado', models.CharField(choices=[('en revision', 'En revisión'), ('descartado', 'Descartado'), ('seleccionado', 'Seleccionado')], default='en revision', max_length=30)),
                ('candidato', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='postulaciones', to=settings.AUTH_USER_MODEL)),
                ('vacante', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='postulaciones', to='empleos.vacante')),
            ],
            options={
                'unique_together': {('candidato', 'vacante')},
            },
        ),
    ]
