from django.forms import ModelForm
from account.models import Profile

class AccountAlterationForm(ModelForm):
    class Meta:
        model = Profile
        fields = ["weight", "age", "region", "height"]