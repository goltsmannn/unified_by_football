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


class BasicPlacemarkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Placemark
        fields = ("id", "name")


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
    placemark_id = serializers.IntegerField(source='placemark.id')
    user_id = serializers.IntegerField(source='user.id')
    delete = serializers.BooleanField()
    expiry = serializers.IntegerField(required=False) # set expiry field as optional
    class Meta:
        model = Activity
        fields = ("user_id", "placemark_id", "expiry", "delete")
        



class GetActivitySerializer(serializers.ModelSerializer):
    user = BasicUserInfoSerializer()
    placemark = BasicPlacemarkSerializer()
    
    class Meta:
        fields = "__all__"
        model = Activity
        

        
# def encode():
#     model = PlacemarkModel(x=22, y=36, type='b')
#     model_sr = PlacemarkSerializer(model)
#     print(model_sr.data, type(model_sr.data), sep='\n')
#     json = JSONRenderer().render(model_sr.data)