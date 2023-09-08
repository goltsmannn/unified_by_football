from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
import IGW.settings as settings
from rest_framework_simplejwt.views import (
    
    TokenRefreshView,
)
from users.views import CustomTokenObtainPairView

#handler403 = ""

urlpatterns = [
    path("__debug__/", include("debug_toolbar.urls")),
    path('admin/', admin.site.urls),
    path('map/', include('map.urls')),
    path('users/', include('users.urls')),
    path('', include('frontend.urls')),   
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

