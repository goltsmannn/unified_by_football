from rest_framework import serializers
from rest_framework.renderers import JSONRenderer

from map.models import Placemark, Review, ReviewPictures


class ReviewPicturesSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReviewPictures
        fields = ["image"]


class ReviewSerializer(serializers.ModelSerializer):
    pictures = ReviewPicturesSerializer(many=True)
    class Meta:
        model = Review 
        fields = ["author", "text", "rating", "pictures"]


class PlacemarkSerializer(serializers.ModelSerializer):
    reviews = ReviewSerializer(many=True)
    class Meta:
        model = Placemark
        fields = "__all__"


class PlacemarkPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Placemark
        fields = "__all__"
# def encode():
#     model = PlacemarkModel(x=22, y=36, type='b')
#     model_sr = PlacemarkSerializer(model)
#     print(model_sr.data, type(model_sr.data), sep='\n')
#     json = JSONRenderer().render(model_sr.data)