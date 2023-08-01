from django.db import models
from rest_framework import serializers
# Create your models here.

class Placemark(models.Model):
    x = models.PositiveIntegerField()
    y = models.PositiveIntegerField()
    type = models.CharField(max_length=1, default='b')

