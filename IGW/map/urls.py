from django.urls import path
from . import views
from django.contrib.auth.views import LoginView
from django.conf.urls.static import static
from IGW.settings import MEDIA_ROOT, MEDIA_URL
urlpatterns = [
    path('login', views.MyLoginView.as_view(), name='login_page'),
    path('register', views.RegisterView.as_view(), name='register_page'),
    path('logout', views.MyLogoutView.as_view(), name='logout_page'),
    path('', views.MainPageTemplateView.as_view(), name='main_page'),
    path('<int:pk>', views.ReviewsListView.as_view(), name='detail_page'),
] + static(MEDIA_URL, document_root=MEDIA_ROOT)

