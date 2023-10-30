from rest_framework import serializers
from rest_framework.renderers import JSONRenderer
from users.serializer import BasicUserInfoSerializer
from map.models import Placemark, Review, ReviewPictures, Activity


class ReviewPicturesSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReviewPictures
        fields = ["image"]


class ReviewSerializer(serializers.ModelSerializer):
    pictures = ReviewPicturesSerializer(many=True)
    author = BasicUserInfoSerializer()
    class Meta:
        model = Review 
        fields = ["author", "text", "rating", "pictures", "id"]


class PlacemarkSerializer(serializers.ModelSerializer):
    reviews = ReviewSerializer(many=True)
    class Meta:
        model = Placemark
        fields = "__all__"


class PlacemarkPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Placemark
        fields = "__all__"


class PostFavoritesSerializer(serializers.ModelSerializer):
    user = BasicUserInfoSerializer()
    placemark_id = serializers.ReadOnlyField(source='placemark.id')
    class Meta:
        model = Placemark
        fields = ("user", "placemark_id")
        

class GetFavoritesSerializer(serializers.ModelSerializer):
    user = BasicUserInfoSerializer()
    placemark = PlacemarkSerializer()
    class Meta:
        model = Placemark
        fields = ("user", "placemark")


class PostActivitySerializer(serializers.ModelSerializer):
    class Meta:
        fields = "__all__"
        depth = 1

class GetActivitySerializer(serializers.ModelSerializer):
    user = BasicUserInfoSerializer()
    class Meta:
        fields = "__all__"
        model = Activity
        depth = 1
# def encode():
#     model = PlacemarkModel(x=22, y=36, type='b')
#     model_sr = PlacemarkSerializer(model)
#     print(model_sr.data, type(model_sr.data), sep='\n')
#     json = JSONRenderer().render(model_sr.data)