from django.urls import path

from . import views

urlpatterns = [
    path('markers/', views.PlacemarkAPIList.as_view(), name='markers_api'),
    path('markers/<int:pk>/' , views.PlacemarkAPIList.as_view(), name='markers_api_put'),

]