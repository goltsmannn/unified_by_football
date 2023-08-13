from django.shortcuts import render
from django.views.generic import DetailView
from django.contrib.auth.models import User# Create your views here.


class ProfileInfoView(DetailView):
    template_name = 'account/profile.html'
    model = User
    context_object_name = 'account'