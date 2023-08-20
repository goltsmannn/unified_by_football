from django.urls import path
from . import views

app_name = 'profile'
#handler403 = views.handler403

urlpatterns = [
    path('<int:pk>/', views.ProfileInfoView.as_view(), name="profile_view_page"),
    path('api/<int:pk>', views.ProfileApiDetail.as_view(), name="profile_detail_page_api")
]
