from django.forms import ModelForm
from users.models import User

class UserAlterationForm(ModelForm):
    class Meta:
        model = User
        fields = ["weight", "age", "region", "height"]