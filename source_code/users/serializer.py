from django.contrib.auth import authenticate
from rest_framework import serializers
from users.models import User, Message, Subscriptions, BlackList
from django.contrib.auth.password_validation import validate_password


class UserSerializer(serializers.ModelSerializer):
    """
    Model for storing detailed info about user (for profile) 
    """
    class Meta:
        model = User
        fields = ["id", "username", "is_staff", "weight", "height", "age", "region", "email", "show_activity"]
        read_only_fields = ["id", "username", "is_staff", "email"]


class UserRegisterSerializer(serializers.Serializer):
    """
    Serializer for handling registration of new users
    """
    email = serializers.EmailField(required=True, error_messages = {'blank': "Missing Email"})
    username = serializers.CharField(required=True, error_messages = {'blank': "Missing Username"})
    password = serializers.CharField(required=True, write_only=True, error_messages = {'blank': "Missing Password"})
    password2 = serializers.CharField(required=True, write_only=True, error_messages = {'blank': "Missing Password Confirmation"})
    referal = serializers.CharField(required=False, default=1)
    
    def validate(self, attrs):
        """
        Confirming uniqueness of email and username and that password and password2 match
        """
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError('Passwords do not match')
        elif User.objects.filter(email=attrs['email']).first() is not None:
            raise serializers.ValidationError('Email is not unique')
        elif User.objects.filter(username=attrs['username']).first() is not None:
            raise serializers.ValidationError('Username is not unique')
        validate_password(attrs['password'])
        return attrs

    def create(self, validated_data):
        """
        Creating user after validation
        """
        user = User.objects.create_user(
            email=validated_data['email'],
            username=validated_data['username'],
            password=validated_data['password']
        )

        return user 

        

class LoginSerializer(serializers.Serializer):
    """Serializer for login endpoint."""
    email = serializers.EmailField(required=True, error_messages = {'blank': "Missing Email"})
    password = serializers.CharField(required=True, write_only=True, error_messages = {'blank': "Missing Password"})

    def check_user(self, validated_data):
        """Checking user authentication (email and password)"""
        user = authenticate(email=validated_data['email'], password=validated_data['password'])
        if not user:
            raise serializers.ValidationError('User not found')
        return user
    


class BasicUserInfoSerializer(serializers.ModelSerializer):
    """Serializer for most used user info (id, username, email, region) for search, messaging, reviews etc."""
    class Meta:
        model = User
        fields = ["id", "username", "email", "region"]
        read_only_fields = ["id", "username", "email", "region"]


class MessageSerializer(serializers.ModelSerializer):
    """Serializer for messages"""
    sender = UserSerializer()
    recipient = UserSerializer()

    class Meta:
        model = Message
        fields = "__all__"


class SubscriptionSerializer(serializers.ModelSerializer):
    """Serializer for subscriptions"""
    user_to = BasicUserInfoSerializer()

    class Meta:
        model = Subscriptions
        fields = ("user_to", "id")


class BlackListSerializer(serializers.ModelSerializer):
    """Serializer for blacklist relationships"""
    user_to = BasicUserInfoSerializer()

    class Meta:
        model = BlackList
        fields = ("user_to", "id")

    