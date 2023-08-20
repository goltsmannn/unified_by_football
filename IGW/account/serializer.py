from rest_framework import serializers 
from django.contrib.auth.models import User
from account.models import Profile

class ProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = Profile
        fields = ["weight", "height", "age", "id", "region"]

        
class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer()
    class Meta:
        model = User 
        fields = ["id", "username", "is_staff", "profile"]

