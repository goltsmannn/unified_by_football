from django.db import models
from rest_framework import serializers
from users.models import User
from datetime import time


class Placemark(models.Model):
    x = models.FloatField()
    y = models.FloatField()
    #fields set by click on map

    name = models.CharField(max_length=30, blank=False)
    description = models.CharField(max_length=200, blank=False)
    #fields set by user (obligatory)

    time_from = models.TimeField(blank=True,default=time(hour=0, minute=0))
    time_to = models.TimeField(blank=True, default=time(hour=23, minute=59))
    #fields set by user (optional)

    type = models.CharField(max_length=1, default='b')
    verified = models.BooleanField(default=False)
    main_image = models.ImageField(upload_to='placemark_main_images', null=True, blank=True)
    #fields set by admin


class Review(models.Model):
    author = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name="reviews") # null = so that when user is removed, reviews are not removed
    text = models.CharField(max_length=200)
    placemark = models.ForeignKey(Placemark, on_delete=models.CASCADE, related_name="reviews")
    rating = models.PositiveSmallIntegerField()


class ReviewPictures(models.Model):
    image = models.ImageField(upload_to='review_pictures/', null=True) 
    review = models.ForeignKey(Review, on_delete=models.CASCADE, related_name="pictures")


class Favorites(models.Model):

    class Meta:
        unique_together = (("user", "placemark"),)
        
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="favorites")
    placemark = models.ForeignKey(Placemark, on_delete=models.CASCADE, related_name="favorites")


class Activity(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="activities")
    placemark = models.ForeignKey(Placemark, on_delete=models.CASCADE, related_name="activities")
    created = models.DateTimeField(auto_now_add=True)
    expiry = models.SmallIntegerField()