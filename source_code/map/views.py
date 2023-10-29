from typing import Any, Dict, Optional
from django.contrib.auth import views as auth_views
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
from map.models import Placemark, Review, ReviewPictures, Favorites
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView
from users.models import User
from map.serializer import PlacemarkSerializer, ReviewSerializer, PlacemarkPostSerializer, FavoritesSerializer
from rest_framework.mixins import RetrieveModelMixin, UpdateModelMixin, ListModelMixin
import rest_framework.viewsets as viewsets
from rest_framework.decorators import api_view
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework import exceptions
from django.core.files.base import ContentFile
import base64



class PlacemarkViewSet(RetrieveModelMixin, ListModelMixin, viewsets.GenericViewSet):
    queryset = Placemark.objects.all()
    serializer_class = PlacemarkSerializer


@api_view(['POST'])
def post_review(request):
    authenticator = JWTAuthentication()
    response = authenticator.authenticate(request=request)
    if response is None:
        raise exceptions.AuthenticationFailed('JWT authentication failed while sending the message')
    if request.data.get('placemark_id') is None:
        raise exceptions.ValidationError('Placemark id is not specified')
    try:
        placemark = Placemark.objects.get(pk=request.data.get('placemark_id'))
    except Placemark.DoesNotExist:
        return Response({'error': 'Placemark does not exist'})
    try:
        review = placemark.reviews.create(author=response[0], text=request.data.get('text'), rating=request.data.get('rating'))
    except Exception as e:
        raise Exception(e)
     
    return Response(ReviewSerializer(review).data)
    

@api_view(['POST'])
def post_placemark(request):
    authenticator = JWTAuthentication()
    response = authenticator.authenticate(request=request)
    if response is None:
        raise exceptions.AuthenticationFailed('JWT authentication failed while sending the message')
    try:
        serializer = PlacemarkPostSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        placemark = serializer.save()
        return Response(PlacemarkPostSerializer(placemark).data)
    except Exception as e:
        raise Exception(e)


@api_view(['POST'])
def post_picture(request):
    authenticator = JWTAuthentication()
    response = authenticator.authenticate(request=request)
    if response is None:
        raise exceptions.AuthenticationFailed('JWT authentication failed while sending the message')
    review = Review.objects.get(pk=request.data.get('review_id'))

    try:
        # Decode the base64 encoded image data
   #     image_data = base64.b64decode(request.data.get('picture'))
        # Create a ContentFile object from the decoded image data
    #    image_file = ContentFile(image_data)
        # Create a ReviewPicture instance and save it to the database
     #   picture = ReviewPictures.objects.create(image=request.data.get('picture'))
        review.pictures.create(image=request.data.get('picture'))
        return Response(ReviewSerializer(review).data)
    except Exception as e:
        raise Exception(e)



class FavoritesAPIView(generics.ListCreateAPIView):
    serializer_class = FavoritesSerializer

    def get(self, request):
        authenticator = JWTAuthentication()
        response = authenticator.authenticate(request=request)
        if response is None:
            raise exceptions.AuthenticationFailed('JWT authentication failed while getting favorites')
        favorites = Favorites.objects.filter(user=response[0].id)
        response = FavoritesSerializer(favorites, many=True)
        return Response(response.data)
    

    def post(self, request):
        authenticator = JWTAuthentication()
        response = authenticator.authenticate(request=request)
        if response is None:
            raise exceptions.AuthenticationFailed('JWT authentication failed while adding to favorites')
        
        user = response[0]
        if request.data.get('delete'):
            try:
                Favorites.objects.get(user=user, placemark__id=request.data.get('placemark_id')).delete()
            except Exception as e:
                raise e 
        else:
            Favorites.objects.create(user=user, 
                                        placemark=Placemark.objects.get(id=request.data.get('placemark_id')))
            
        favorites = Favorites.objects.filter(user=response[0].id)
        response = FavoritesSerializer(favorites, many=True)       
        return Response(response.data)
    

    
#     template_name = 'map/main_map.html'

    
# class MyLoginView(auth_views.LoginView):
#     next_page = reverse_lazy('map:main_page')
#     redirect_authenticated_user = reverse_lazy('map:main_page')
    


# class MyLogoutView(auth_views.LogoutView):
#     next_page = reverse_lazy('map:main_page')



# class RegisterView(CreateView):
#     def form_valid(self, form):
#         self.object = form.save()
#         user = User.objects.create(user=self.object)
#         user.save()
#         return redirect(self.get_success_url())
        

#     template_name = 'registration/register.html'
#     model = User
#     form_class = MyCreationForm
#     success_url = reverse_lazy('map:login_page')


# class ReviewsListView(DetailView):
#     template_name ='map/map_details.html'  

#     def get_object(self) -> Review:
#         return ReviewPictures.objects.select_related('review', 'review__placemark').filter(review__placemark__pk=self.kwargs['pk'])

#     def get_context_data(self, **kwargs: Any) -> Dict[str, Any]:
#         context = super().get_context_data(**kwargs)
#         context['pictures'] = context['object']
#         del context['object']
#         return context
    


class PlacemarkViewSet(RetrieveModelMixin, ListModelMixin, viewsets.GenericViewSet):
    queryset = Placemark.objects.all()
    serializer_class = PlacemarkSerializer

