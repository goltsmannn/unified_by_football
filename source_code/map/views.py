import base64
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
from map.models import Placemark, Review, ReviewPictures, Favorites, Activity
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView
from users.models import User
from map.serializer import PlacemarkSerializer, ReviewSerializer, PlacemarkPostSerializer, PostFavoritesSerializer, GetFavoritesSerializer, GetActivitySerializer, PostActivitySerializer
from rest_framework.mixins import RetrieveModelMixin, UpdateModelMixin, ListModelMixin
import rest_framework.viewsets as viewsets
from rest_framework import exceptions
from django.core.files.base import ContentFile
import base64
# from users.authentication import JWTAuthentication
from rest_framework.exceptions import ParseError, AuthenticationFailed, ValidationError
from rest_framework.decorators import api_view, authentication_classes
import datetime
import pytz
from rest_framework_simplejwt.authentication import JWTAuthentication
from users.models import User


class PlacemarkViewSet(RetrieveModelMixin, ListModelMixin, viewsets.GenericViewSet):
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
    


class ActivityAPIView(generics.ListAPIView, generics.CreateAPIView):
    serializer_class = GetActivitySerializer
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        response = None
        if request.query_params.get('get_by') == 'placemark':
            response = Activity.objects.filter(placemark__id=request.query_params.get('placemark_id'))
        elif request.query_params.get('get_by') == 'user':
            response = Activity.objects.filter(user__id=request.query_params.get('user_id'))
        if response is None:
            raise exceptions.APIException('Lacking details')
        return Response(GetActivitySerializer(response, many=True).data)

    def post(self, request):
        serializer = PostActivitySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            if serializer.validated_data.get('delete'):
                Activity.objects.get(user__id=serializer.validated_data['user']['id'], 
                                    placemark__id=serializer.validated_data['placemark']['id']).delete()
                response = Activity.objects.filter(user__id=serializer.validated_data['user']['id'])
                return Response(GetActivitySerializer(response, many=True).data)
            else:
                last_activity = Activity.objects.filter(user__id=serializer.validated_data['user']['id']).last()
                if last_activity is not None:
                    tz = pytz.timezone('Europe/Moscow')
                    expiry = last_activity.created + datetime.timedelta(hours=last_activity.expiry)
                    if datetime.datetime.now(tz=tz) < expiry:
                        raise exceptions.APIException('EXPIRY_ERROR')

                response = Activity.objects.create(user=User.objects.get(pk=serializer.validated_data['user']['id']), 
                                    placemark=Placemark.objects.get(pk=serializer.validated_data['placemark']['id']),
                                    expiry=serializer.validated_data.get('expiry'))
                
                return(Response(GetActivitySerializer(response).data))
        except Exception as e:
            raise e

#     template_name = 'map/main_map.html'


    

# from django.contrib.auth import views as auth_views
# from django.core.files.base import ContentFile
# from django.db import models
# from django.db.models.query import QuerySet
# from django.forms.models import BaseModelForm
# frgom django.http import HttpResponse
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
    

