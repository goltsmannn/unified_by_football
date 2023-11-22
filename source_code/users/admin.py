from django.contrib import admin
from users.models import User, Message, Subscriptions, BlackList, Referals, PasswordResetToken
# Register your models here.
admin.site.register(User)
admin.site.register(Message)
admin.site.register(Subscriptions)
admin.site.register(BlackList)
admin.site.register(Referals)
admin.site.register(PasswordResetToken)