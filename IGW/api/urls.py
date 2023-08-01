from django.urls import path

from . import views

urlpatterns = [
    path('markers/', views.PlacemarkApiView.as_view(), name='markers_api')
]