from rest_framework import serializers 
from rest_framework.fields import empty
from users.models import User, Message, Subscriptions
from django.contrib.auth import get_user_model, authenticate


class UserSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = User
        fields = ["id", "username", "is_staff", "weight", "height", "age", "region", "email"]
        read_only_fields = ["id", "username", "is_staff", "email"]


class UserRegisterSerializer(serializers.Serializer):

    email = serializers.EmailField(required=True)
    username = serializers.CharField(required=True)
    password = serializers.CharField(required=True, write_only=True)
    password2 = serializers.CharField(required=True, write_only=True)
    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError('Passwords do not match')
        elif User.objects.filter(email=attrs['email']).first() is not None:
            raise serializers.ValidationError('Email is not unique')
        elif User.objects.filter(username=attrs['username']).first() is not None:
            raise serializers.ValidationError('Username is not unique')

        return attrs

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            username=validated_data['username'],
            password=validated_data['password']
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
    


class BasicUserInfoSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = User
        fields = ["id", "username", "email", "region"]
        read_only_fields = ["id", "username", "email", "region"]


class MessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer()
    recipient = UserSerializer()

    class Meta:
        model = Message
        fields = "__all__"


class SubscriptionSerializer(serializers.ModelSerializer):
    user_to = BasicUserInfoSerializer()

    class Meta:
        model = Subscriptions
        fields = ("user_to", "id")