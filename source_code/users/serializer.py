from rest_framework import serializers 
from rest_framework.fields import empty
from users.models import User



class UserSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = User
        fields = ["id", "username", "is_staff", "weight", "height", "age", "id", "region"]
        read_only_fields = ["id", "username", "is_staff"]
