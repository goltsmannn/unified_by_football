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
    region = models.CharField(max_length=4, choices=REGION_IN_MOSCOW_CHOICES, null=True, blank=True)
    height = models.PositiveSmallIntegerField(null=True, blank=True)
    age = models.PositiveSmallIntegerField( null=True, blank=True)
    weight = models.PositiveSmallIntegerField( null=True, blank=True)
#    profile_picture = models.ImageField()


class Subscriptions(models.Model):
    user_id = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name="target_user")
    friend_id = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name="friend_user")
    