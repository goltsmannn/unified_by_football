from django.urls import include, path
from . import views
from django.contrib.auth.views import LoginView
from django.conf.urls.static import static
from IGW.settings import MEDIA_ROOT, MEDIA_URL
from rest_framework import routers


app_name ='map'
router = routers.DefaultRouter()
router.register(r'placemarks', views.PlacemarkViewSet, basename="map")
#print(router.urls)

urlpatterns = [
    # path('login', views.MyLoginView.as_view(), name='login_page'),
    # path('register', views.RegisterView.as_view(), name='register_page'),
    # path('logout', views.MyLogoutView.as_view(), name='logout_page'),
    # path('', views.MainPageTemplateView.as_view(), name='main_page'),
    # path('<int:pk>', views.ReviewsListView.as_view(), name='detail_page'),
    path('', include((router.urls))),
    path('review/post', views.post_review, name='review-post'),
    path('placemark/post', views.post_placemark, name='placemark-post'),
    path('review/picture/post', views.post_picture, name='picture-post'),
    path('favorites', views.FavoritesAPIView.as_view(), name='favorites'),
    path('activity', views.ActivityAPIView.as_view(), name='activity-get'),
    path('report', views.PostReportAPIView.as_view(), name='report-post'),
] + static(MEDIA_URL, document_root=MEDIA_ROOT)

