from typing import Any, Dict, Optional
from django.db import models
from django.db.models.query import QuerySet
from django.http import HttpResponse
from django.shortcuts import get_object_or_404, render
from django.urls import reverse, reverse_lazy
from map.models import Placemark, ReviewPictures, Review
from django.views.generic import TemplateView, CreateView, ListView, DetailView
from django.contrib.auth import views as auth_views
from map.forms import MyCreationForm
from django.contrib.auth.models import User


class MainPageTemplateView(TemplateView):
    template_name = 'map/main_map.html'
    # def get_context_data(self, **kwargs: Any) -> Dict[str, Any]:
    #     data= super().get_context_data(**kwargs)
    #     print(data['view'].request.session.__dir__())
    #     return data

    
class MyLoginView(auth_views.LoginView):
    next_page = reverse_lazy('map:main_page')
    redirect_authenticated_user = reverse_lazy('map:main_page')
    


class MyLogoutView(auth_views.LogoutView):
    next_page = reverse_lazy('map:main_page')



class RegisterView(CreateView):
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


