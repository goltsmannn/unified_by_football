from django.contrib import admin
from .models import Placemark, Review, ReviewPictures, Favorites, Activity
# Register your models here.
admin.site.register(Placemark)
admin.site.register(ReviewPictures)
admin.site.register(Review)
admin.site.register(Favorites)
admin.site.register(Activity)