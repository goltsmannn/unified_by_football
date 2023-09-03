from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User


class MyCreationForm(UserCreationForm):
    class Meta:
        model = User 
        fields = ['username', 'password1', 'password2']
    
   # def validate_password(password, user=None, password_validators=None):
       # return True