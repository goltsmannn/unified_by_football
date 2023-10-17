from django.urls import include, path
from . import views
from rest_framework import routers

app_name = 'users'

router = routers.DefaultRouter()
router.register(r'', views.UserViewSet, basename="users")

urlpatterns = [
    path('', include((router.urls))),
    path('auth/register', views.RegisterUserAPIView.as_view(), name='register-api'),
    path('auth/login', views.LoginUserAPIView.as_view(), name='login-api'),
    path('auth/logout', views.LogoutUserAPIView.as_view(), name='logout-api'),
    path('auth/retrieve_user_by_token', views.retrieve_user_by_token, name='retrieve_user_by_token'),
    path('auth/update_user_by_token', views.update_user_by_token, name='update_user_by_token'),
    path('retrieve_users_basic_info', views.ListUserBasicInfo.as_view(), name='retrieve_users_basic_info'),
    path('messages/details/<int:message_id>', views.retrieve_message, name='get-message-details'),
    path('messages/all/<int:recipient_id>', views.ListMessagesAPIView.as_view(), name='get-user-messages'),
    path('messages/create', views.CreateMessageAPIView.as_view(), name='create-message'),
] 

# urlpatterns = [ 
#     path('<int:pk>/', views.profile_view, name="profile_view_page"),
#     path('api/profileapi/getput/<int:pk>', views.ProfileApiDetail.as_view(), name="profile_detail_page_api"),
#     path('api/userapi/get/<int:pk>', views.UserApiDetail.as_view(), name="user_detail_page")
# ]
