import base64
from django.contrib.auth import views as auth_views
from django.forms.models import BaseModelForm
from django.http import HttpResponse, HttpRequest
from django.views.generic.detail import DetailView
from map.forms import MyCreationForm
from map.models import Placemark, Review, Favorites, Activity, Report
from rest_framework import generics, exceptions
from rest_framework.response import Response
from users.models import User
from map.serializer import PlacemarkSerializer, ReviewSerializer, PlacemarkPostSerializer, PostFavoritesSerializer, \
    GetFavoritesSerializer, GetActivitySerializer, PostActivitySerializer, ReportSerializer
from rest_framework.mixins import RetrieveModelMixin, UpdateModelMixin, ListModelMixin
import rest_framework.viewsets as viewsets
from django.core.files.base import ContentFile
from rest_framework.decorators import api_view, authentication_classes
import datetime
import pytz
from rest_framework_simplejwt.authentication import JWTAuthentication


class PlacemarkViewSet(RetrieveModelMixin, ListModelMixin, viewsets.GenericViewSet):
    """
    Viewset for listing placemarks and retrieving a single placemark with detailed info. Not protected by JWT.
    """
    authentication_classes = []
    queryset = Placemark.objects.all()
    serializer_class = PlacemarkSerializer


@api_view(['POST'])
@authentication_classes([JWTAuthentication])
def post_review(request: HttpRequest) -> Response:
    """Endpoint for posting the review. Requires JWT authentication. Placemark id must be specified in the request data, not in the url."""
    if request.data.get('placemark_id') is None:
        raise exceptions.ParseError('Placemark id is not specified')
    try:
        placemark = Placemark.objects.get(pk=request.data.get('placemark_id'))
        review = placemark.reviews.create(author=request.user, text=request.data.get('text'),
                                            rating=request.data.get('rating'))

    except Placemark.DoesNotExist:
        raise exceptions.APIException('Placemark does not exist')
    except Exception as e:
        raise Exception(e)

    return Response(ReviewSerializer(review).data)


@api_view(['POST'])
@authentication_classes([JWTAuthentication])
def post_placemark(request: HttpRequest) -> Response:
    """Endpoint for proposing the placemark. Requires JWT authentication. The placemark will be hidden upon verification from the admin panel"""
    try:
        serializer = PlacemarkPostSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        placemark = serializer.save()
        return Response(PlacemarkPostSerializer(placemark).data)
    except Exception as e:
        raise Exception(e)


@api_view(['POST'])
@authentication_classes([JWTAuthentication])
def post_picture(request: HttpRequest) -> Response:
    """Separate endpoint for posting the binary picture data for the optimization purposes. Requires JWT authentication. """
    review = Review.objects.get(pk=request.data.get('review_id'))

    try:
        review.pictures.create(image=request.data.get('picture'))
        return Response(ReviewSerializer(review).data)
    except Exception as e:
        raise Exception(e)


class FavoritesAPIView(generics.ListCreateAPIView):
    """APIView for handling favorite placemark list and adding/removing placemarks from the list. Requires JWT authentication."""
    serializer_class = PostFavoritesSerializer
    authentication_classes = [JWTAuthentication]

    def get(self, request: HttpRequest) -> Response:
        """Getting list of favorite placemarks for the user"""
        favorites = Favorites.objects.filter(user=request.user.id)
        response = GetFavoritesSerializer(favorites, many=True)
        return Response(response.data)

    def post(self, request: HttpRequest) -> Response:
        """Adding or removing placemark from the list (depends on the 'delete' flag in the request)"""
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
    """APIView for adding user activity, retrieving activity by placemark or user. Requires JWT authentication."""
    serializer_class = GetActivitySerializer
    authentication_classes = [JWTAuthentication]

    def get(self, request) -> Response:
        """Get activity by placemark or user. The filter is specified in the request query params. So are the placemarks and users ids."""
        response = None
        if request.query_params.get('get_by') == 'placemark':
            response = Activity.objects.filter(placemark__id=request.query_params.get('placemark_id'))
        elif request.query_params.get('get_by') == 'user':
            response = Activity.objects.filter(user__id=request.query_params.get('user_id'))
        if response is None:
            raise exceptions.APIException('Lacking details')
        response.order_by('-created')
        return Response(GetActivitySerializer(response, many=True).data)

    def post(self, request) -> Response:
        """Handling post activity request. If the 'delete' flag is set to True, the activity will be deleted. Otherwise, the new activity will be added."""
        serializer = PostActivitySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            if serializer.validated_data.get('delete'):
                Activity.objects.get(pk=serializer.validated_data['activity_id']).delete()
                response = Activity.objects.filter(user__id=request.user.id)
                return Response(GetActivitySerializer(response, many=True).data)
            elif serializer.validated_data.get('finished_early'):
                activity = Activity.objects.get(pk=serializer.validated_data['activity_id'])
                if activity.finished_early is not None:
                    raise exceptions.APIException('ALREADY_FINISHED')
                activity.finished_early = datetime.datetime.now(tz=pytz.timezone('Europe/Moscow'))
                activity.save()
                response = Activity.objects.filter(user__id=request.user.id)
                return Response(GetActivitySerializer(response, many=True).data)
            else:
                last_activity = Activity.objects.filter(user__id=request.user.id).last()
                if last_activity is not None:
                    tz = pytz.timezone('Europe/Moscow')
                    expiry = last_activity.finished_early if last_activity.finished_early else (last_activity.created + datetime.timedelta(hours=last_activity.expiry))
                    if datetime.datetime.now(tz=tz) < expiry:
                        raise exceptions.APIException('EXPIRY_ERROR')

                response = Activity.objects.create(user=User.objects.get(pk=request.user.id),
                                                    placemark=Placemark.objects.get(
                                                    pk=serializer.validated_data['placemark']['id']),
                                                    expiry=serializer.validated_data.get('expiry'))

                return (Response(GetActivitySerializer(response).data))
        except Exception as e:
            raise e


class PostReportAPIView(generics.CreateAPIView):
    """Class for user reports of false reviews"""
    authentication_classes = [JWTAuthentication]
    serializer_class = ReportSerializer

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
