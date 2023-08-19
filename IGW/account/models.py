from django.db import models
from django.contrib.auth.models import User
# Create your models here.

class Profile(models.Model):
    REGION_IN_MOSCOW_CHOICES = [
        ('CAO', "Центральный административный округ"),
        ('NAO', "Северный административный округ"),
        ('NEAO', "Северо-Восточный административный округ"),
        ('EAO', "Восточный административный округ"),
        ('SEAO', "Юго-Восточный административный округ"),
        ('SAO', "Южный административный округ"),
        ('SWAO', "Юго-Западный административный округ"),
        ('WAO', "Западный административный округ"),
        ('NWAO', "Северо-Западный административный округ"),

    ]
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    region = models.CharField(max_length=4, choices=REGION_IN_MOSCOW_CHOICES, default=None)
    height = models.PositiveSmallIntegerField(default=None)
    age = models.PositiveSmallIntegerField(default=None)
    weight = models.PositiveSmallIntegerField(default=None)
#    profile_picture = models.ImageField()
