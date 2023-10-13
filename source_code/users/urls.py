from django.urls import include, path
from . import views
from rest_framework import routers

app_name = 'users'

router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet, basename="users")
#print(router.urls)

urlpatterns = [
    path('api/', include((router.urls))),
    path('api/auth/register', views.RegisterUserAPIView.as_view(), name='register-api'),
    path('api/auth/login', views.LogoutUserAPIView.as_view(), name='login-api'),
    path('api/auth/logout', views.LogoutUserAPIView.as_view(), name='logout-api'),
    path('api/auth/retrieve_user_by_token', views.retrieve_user_by_token, name='retrieve_user_by_token'),
    path('api/auth/update_user_by_token', views.update_user_by_token, name='update_user_by_token')
] 

# urlpatterns = [
#     path('<int:pk>/', views.profile_view, name="profile_view_page"),
#     path('api/profileapi/getput/<int:pk>', views.ProfileApiDetail.as_view(), name="profile_detail_page_api"),
#     path('api/userapi/get/<int:pk>', views.UserApiDetail.as_view(), name="user_detail_page")
# ]
