import base64
from typing import Any, Dict, Optional

import rest_framework.viewsets as viewsets
from map.models import Activity, Favorites, Placemark, Review, ReviewPictures
from map.serializer import (GetActivitySerializer, GetFavoritesSerializer,
                            PlacemarkPostSerializer, PlacemarkSerializer,
                            PostActivitySerializer, PostFavoritesSerializer,
                            ReviewSerializer)
from rest_framework import exceptions, generics
from rest_framework.decorators import api_view, authentication_classes
# from users.authentication import JWTAuthentication
from rest_framework.exceptions import (AuthenticationFailed, ParseError,
                                       ValidationError)
from rest_framework.mixins import (ListModelMixin, RetrieveModelMixin,
                                   UpdateModelMixin)
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication
from users.models import User


class PlacemarkViewSet(RetrieveModelMixin, ListModelMixin, viewsets.GenericViewSet):
    #authentication_classes = [JWTAuthentication]
    queryset = Placemark.objects.all()
    serializer_class = PlacemarkSerializer



@api_view(['POST'])
@authentication_classes([JWTAuthentication])
def post_review(request):
    if request.data.get('placemark_id') is None:
        raise exceptions.ParseError('Placemark id is not specified')
    try:
        placemark = Placemark.objects.get(pk=request.data.get('placemark_id'))
        review = placemark.reviews.create(author=request.user, text=request.data.get('text'), rating=request.data.get('rating'))

    except Placemark.DoesNotExist:
        raise exceptions.APIException('Placemark does not exist')
    except Exception as e:
        raise Exception(e)
     
    return Response(ReviewSerializer(review).data)
    

@api_view(['POST'])
@authentication_classes([JWTAuthentication])
def post_placemark(request):
    try:
        serializer = PlacemarkPostSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        placemark = serializer.save()      
        return Response(PlacemarkPostSerializer(placemark).data)
    except Exception as e:
        raise Exception(e)


@api_view(['POST'])
@authentication_classes([JWTAuthentication])
def post_picture(request):
    review = Review.objects.get(pk=request.data.get('review_id'))

    try:
        review.pictures.create(image=request.data.get('picture'))
        return Response(ReviewSerializer(review).data)
    except Exception as e:
        raise Exception(e)



class FavoritesAPIView(generics.ListCreateAPIView):
    serializer_class = PostFavoritesSerializer
    authentication_classes = [JWTAuthentication]
    def get(self, request):
        favorites = Favorites.objects.filter(user=request.user.id)
        response = GetFavoritesSerializer(favorites, many=True)
        return Response(response.data)
    

    def post(self, request):
        
        if request.data.get('delete'):
            try:
                Favorites.objects.get(user=request.user, placemark__id=request.data.get('placemark_id')).delete()
            except Exception as e:
                raise e 
        else:
            Favorites.objects.create(user=request.user, 
                                        placemark=Placemark.objects.get(id=request.data.get('placemark_id')))
            
        favorites = Favorites.objects.filter(user=request.user)
        response = GetFavoritesSerializer(favorites, many=True)       
        return Response(response.data)
    


class GetActivity(generics.ListAPIView):
    serializer_class = GetActivitySerializer
    authentication_classes = [JWTAuthentication]
    
    def get(self, request):    
        response = None
        print(request.query_params)
        if request.query_params.get('get_by') == 'placemark':
            response = Activity.objects.filter(placemark__id=request.query_params.get('placemark_id'))
        elif request.query_params.get('get_by') == 'user':
            response = Activity.objects.filter(user__id=request.query_params.get('user_id'))
        if response is None:
            raise exceptions.ValidationError('Lacking data for filtering')
        return Response(GetActivitySerializer(response, many=True).data)
#     template_name = 'map/main_map.html'

    

# from django.contrib.auth import views as auth_views
# from django.core.files.base import ContentFile
# from django.db import models
# from django.db.models.query import QuerySet
# from django.forms.models import BaseModelForm
# from django.http import HttpResponse
# from django.shortcuts import get_object_or_404, redirect, render
# from django.urls import reverse, reverse_lazy
# from django.views.generic.base import TemplateView
# from django.views.generic.detail import DetailView
# from django.views.generic.edit import CreateView, FormView
# from map.forms import MyCreationForm
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
    

