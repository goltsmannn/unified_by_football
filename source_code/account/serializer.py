from rest_framework import serializers 
from django.contrib.auth.models import User
from rest_framework.fields import empty
from account.models import Profile


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User 
        fields = ["id", "username", "is_staff"]
        read_only_fields = ["id", "username", "is_staff"]


class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer
    
    class Meta:
        model = Profile
        fields = ["weight", "height", "age", "id", "region", "user"]
        read_only_fields = ["user"]
