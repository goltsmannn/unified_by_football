from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from . import views

urlpatterns = [
    path('', views.main_page, name='main_page'),
    path('<int:pk>', views.show_details, name='detail_page'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

