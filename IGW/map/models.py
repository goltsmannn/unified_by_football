from django.db import models
from rest_framework import serializers
# Create your models here.

class Placemark(models.Model):
    x = models.FloatField()
    y = models.FloatField()
    type = models.CharField(max_length=1, default='b')
    description = models.CharField(max_length=200, default='')


class Review(models.Model):
    author = models.CharField(max_length=10)
    text = models.CharField(max_length=200)
    placemark = models.ForeignKey(Placemark, on_delete=models.CASCADE, related_name="reviews")
    rating = models.PositiveSmallIntegerField()


class ReviewPictures(models.Model):
    image = models.ImageField(upload_to='review_pictures/') 
    review = models.ForeignKey(Review, on_delete=models.CASCADE, related_name="pictures")