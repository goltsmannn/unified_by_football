#from django.forms import ValidationError
from rest_framework import serializers 
from rest_framework.fields import empty
from users.models import User
from django.contrib.auth import get_user_model, authenticate


class UserSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = User
        fields = ["id", "username", "is_staff", "weight", "height", "age", "region"]
        read_only_fields = ["id", "username", "is_staff"]


class UserRegisterSerializer(serializers.ModelSerializer):

    email = serializers.EmailField(required=True)
    username = serializers.CharField(required=True)
    password = serializers.CharField(required=True, write_only=True)
    password2 = serializers.CharField(required=True, write_only=True)
    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError('Passwords do not match')
        return attrs

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data.email,
            password=validated_data.password,
            username=validated_data.username
        )
        return user
        

class LoginSerializer(serializers.ModelSerializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def check_user(self, validated_data):
        user = authenticate(email=validated_data.email, password=validated_data.password)
        if not user:
            raise serializers.ValidationError('User not found')
        return user