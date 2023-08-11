from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from . import views
from django.contrib.auth.views import LoginView

urlpatterns = [
    path('login', views.MyLoginView.as_view(), name='login_page'),
    path('register', views.RegisterView.as_view(), name='register_page'),
    path('logout', views.MyLogoutView.as_view(), name='logout_page'),
    path('', views.MainPageTemplateView.as_view(), name='main_page'),
    path('<int:pk>', views.ReviewsListView.as_view(), name='detail_page'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

