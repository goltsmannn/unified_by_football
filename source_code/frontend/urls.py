from django.urls import path, re_path
from . import views

#regex = r"^(?!api).*$"
regex = r"^(?!.*api.*)(?!.*media.*).*$"
urlpatterns = [
    re_path(regex, views.index),
  #  path('', views.index),
]
