from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
import IGW.settings as settings
from rest_framework_simplejwt.views import (
    
    TokenRefreshView,
)
from users.views import CustomTokenObtainPairView

#handler403 = ""

urlpatterns = [ #regex на api, остальное рендерится индексом
    path("__debug__/", include("debug_toolbar.urls")),
    path('api/admin/', admin.site.urls),
    path('api/map/', include('map.urls')),
    path('api/users/', include('users.urls')),
    path('', include('frontend.urls')),  #вот этим индексом 
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

