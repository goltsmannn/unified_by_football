from django.contrib import admin
from users.models import User, Message, Subscriptions, BlackList
# Register your models here.
admin.site.register(User)
admin.site.register(Message)
admin.site.register(Subscriptions)
admin.site.register(BlackList)