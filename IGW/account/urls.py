from django.urls import path
from . import views

app_name = 'profile'
#handler403 = views.handler403

urlpatterns = [
    path('<int:pk>/', views.profile_view, name="profile_view_page"),
    path('api/profileapi/getput/<int:pk>', views.ProfileApiDetail.as_view(), name="profile_detail_page_api"),
    path('api/userapi/get/<int:pk>', views.UserApiDetail.as_view(), name="user_detail_page")
]
