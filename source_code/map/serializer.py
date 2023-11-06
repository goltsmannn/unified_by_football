from rest_framework import serializers
from rest_framework.renderers import JSONRenderer
from users.serializer import BasicUserInfoSerializer
from map.models import Placemark, Review, ReviewPictures, Activity, Report
from users.models import User

class ReviewPicturesSerializer(serializers.ModelSerializer):
    """Serializer for pictures in the review"""
    class Meta:
        model = ReviewPictures
        fields = ["image"]


class ReviewSerializer(serializers.ModelSerializer):
    """Serializer for reviews"""
    pictures = ReviewPicturesSerializer(many=True)
    author = BasicUserInfoSerializer()
    class Meta:
        model = Review 
        fields = ["author", "text", "rating", "pictures", "id"]


class PlacemarkSerializer(serializers.ModelSerializer):
    """Extended serializer for placemarks (for detailed info)"""
    reviews = ReviewSerializer(many=True)
    class Meta:
        model = Placemark
        fields = "__all__"


class BasicPlacemarkSerializer(serializers.ModelSerializer):
    """Basic serializer for placemarks (used when multiple placemarks are returned)"""
    class Meta:
        model = Placemark
        fields = ("id", "name")


class PlacemarkPostSerializer(serializers.ModelSerializer):
    """Serializer for placemark proposal page"""
    class Meta:
        model = Placemark
        fields = "__all__"


class PostFavoritesSerializer(serializers.ModelSerializer):
    """Serializer for adding or removing placemark from favorites (required only basic info about placemark and user)"""
    user = BasicUserInfoSerializer()
    placemark_id = serializers.ReadOnlyField(source='placemark.id')
    class Meta:
        model = Placemark
        fields = ("user", "placemark_id")
        

class GetFavoritesSerializer(serializers.ModelSerializer):
    """Serializer for getting favorites (includes some additional info about placemark and user to avoid extra requests)"""
    user = BasicUserInfoSerializer()
    placemark = PlacemarkSerializer()
    class Meta:
        model = Placemark
        fields = ("user", "placemark")




class PostActivitySerializer(serializers.ModelSerializer):
    """Serializer for adding or removing activity at placemark (required only basic info about placemark and user). Expiry field's value is retrieved from a slider"""
    placemark_id = serializers.IntegerField(source='placemark.id')
    user_id = serializers.IntegerField(source='user.id')
    delete = serializers.BooleanField()
    expiry = serializers.IntegerField(required=False) # set expiry field as optional
    class Meta:
        model = Activity
        fields = ("user_id", "placemark_id", "expiry", "delete")
        



class GetActivitySerializer(serializers.ModelSerializer):
    """Serializer for getting user activity"""
    user = BasicUserInfoSerializer()
    placemark = BasicPlacemarkSerializer()
    
    class Meta:
        fields = "__all__"
        model = Activity
        

class ReportSerializer(serializers.ModelSerializer):
    """Serializer for reporting false reviews"""
    review_id = serializers.IntegerField(source='review.id')
    user_id = serializers.IntegerField(source='reporter.id')
    reason = serializers.CharField(required=True)

    class Meta:
        model = Report
        fields = ("review_id", "user_id", "reason")
    
    def create(self, validated_data):
        """To make the report apiview as compact as possible"""
        try:
            user = User.objects.get(pk=validated_data['reporter']['id'])
            review = Review.objects.get(pk=validated_data['review']['id'])
            return Report.objects.create(reporter=user, review=review, reason=validated_data['reason'])
        except (User.DoesNotExist, Review.DoesNotExist):
            raise exceptions.APIException('User or review do not exist')
        except Exception as e:
            raise e

            
# def encode():
#     model = PlacemarkModel(x=22, y=36, type='b')
#     model_sr = PlacemarkSerializer(model)
#     print(model_sr.data, type(model_sr.data), sep='\n')
#     json = JSONRenderer().render(model_sr.data)