from django.urls import path
from . import views

app_name = 'account'
#handler403 = views.handler403

urlpatterns = [
    path('<int:pk>/', views.ProfileInfoView.as_view(), name="account_view_page"),
]
