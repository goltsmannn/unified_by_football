from typing import Any, Dict, Optional
from django.contrib.auth import views as auth_views
from django.contrib.auth.models import User
from django.db import models
from django.db.models.query import QuerySet
from django.forms.models import BaseModelForm
from django.http import HttpResponse
from django.shortcuts import get_object_or_404, render, redirect
from django.urls import reverse, reverse_lazy
from django.views.generic.edit import CreateView, FormView
from django.views.generic.detail import DetailView
from django.views.generic.base import TemplateView
from map.forms import MyCreationForm
from map.models import Placemark, Review, ReviewPictures
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView
from account.models import Profile
from map.serializer import PlacemarkSerializer


class MainPageTemplateView(TemplateView):
    template_name = 'map/main_map.html'

    
class MyLoginView(auth_views.LoginView):
    next_page = reverse_lazy('map:main_page')
    redirect_authenticated_user = reverse_lazy('map:main_page')
    


class MyLogoutView(auth_views.LogoutView):
    next_page = reverse_lazy('map:main_page')



class RegisterView(CreateView):
    def form_valid(self, form):
        self.object = form.save()
        profile = Profile.objects.create(user=self.object)
        profile.save()
        return redirect(self.get_success_url())
        

    template_name = 'registration/register.html'
    model = User
    form_class = MyCreationForm
    success_url = reverse_lazy('map:login_page')


class ReviewsListView(DetailView):
    template_name ='map/map_details.html'  

    def get_object(self) -> Review:
        return ReviewPictures.objects.select_related('review', 'review__placemark').filter(review__placemark__pk=self.kwargs['pk'])

    def get_context_data(self, **kwargs: Any) -> Dict[str, Any]:
        context = super().get_context_data(**kwargs)
        context['pictures'] = context['object']
        del context['object']
        return context
    




class PlacemarkAPIList(generics.ListCreateAPIView):
    queryset = Placemark.objects.all()
    serializer_class = PlacemarkSerializer
    

