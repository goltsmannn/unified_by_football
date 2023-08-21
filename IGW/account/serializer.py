from rest_framework import serializers 
from django.contrib.auth.models import User
from rest_framework.fields import empty
from account.models import Profile

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ["weight", "height", "age", "id", "region"]

    

        
class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer()

    def update(self, instance, validated_data):
        instance = instance.profile
       # print(self, instance, validated_data, sep='\n\n')
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
    
    # def is_valid(self, *, raise_exception=False):
    #     return super().is_valid(raise_exception=True)
        
    # def run_validation(self, data=...):
    #     print(data)
    #     return super().run_validation(data)

    # def validate_empty_values(self, data):
    #     print()
    #     return super().validate_empty_values(data)
    
    # def run_validators(self, value):
    #     print(value)
    #     return super().run_validators(value)
    class Meta:
        model = User 
        fields = ["id", "username", "is_staff", "profile"]
        read_only_fields = ["id", "username", "is_staff"]


