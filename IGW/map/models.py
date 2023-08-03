from django.db import models
from rest_framework import serializers
# Create your models here.

class Placemark(models.Model):
    x = models.FloatField()
    y = models.FloatField()
    type = models.CharField(max_length=1, default='b')
    description = models.CharField(max_length=200, default='')


