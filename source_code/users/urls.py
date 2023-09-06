from django.urls import include, path
from . import views
from rest_framework import routers

app_name = 'users'

router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet, basename="users")
#print(router.urls)

urlpatterns = [
    path('api/', include((router.urls))),
] 

# urlpatterns = [
#     path('<int:pk>/', views.profile_view, name="profile_view_page"),
#     path('api/profileapi/getput/<int:pk>', views.ProfileApiDetail.as_view(), name="profile_detail_page_api"),
#     path('api/userapi/get/<int:pk>', views.UserApiDetail.as_view(), name="user_detail_page")
# ]
