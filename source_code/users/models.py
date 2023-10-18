from typing import Any
from django.db import models
from django.contrib.auth.models import AbstractUser, AbstractBaseUser, BaseUserManager
from django.contrib.auth.models import PermissionsMixin
from jwt import encode
from datetime import datetime, timedelta, timezone
from IGW.settings import SECRET_KEY
from django.utils import timezone

class UserManager(BaseUserManager):
    def create_user(self, username, email, password=None, **kwargs):
        if username is None or email is None:
            raise TypeError('Missing registration field')
        
        user = self.model(username=username, email=self.normalize_email(email), **kwargs)
        user.set_password(password)
        user.save()

        return user 
    

    def create_superuser(self, username, email, password):
        if password is None:
            raise TypeError('Missing registration field')

        user = self.create_user(username, email, password)
        user.is_superuser = True
        user.is_staff = True
        user.save()

        return user


class User(AbstractBaseUser, PermissionsMixin):
    class Meta:
        db_table = "auth_user"


    REGION_IN_MOSCOW_CHOICES = [
        ('CAO', "Центральный административный округ"),
        ('NAO', "Северный административный округ"),
        ('NEAO', "Северо-Восточный административный округ"),
        ('EAO', "Восточный административный округ"),
        ('SEAO', "Юго-Восточный административный округ"),
        ('SAO', "Южный административный округ"),
        ('SWAO', "Юго-Западный административный округ"),
        ('WAO', "Западный административный округ"),
        ('NWAO', "Северо-Западный административный округ"),
    ]
    username = models.CharField(db_index=True, max_length=255, unique=True) #blabk true
    email = models.EmailField(db_index=True, unique=True, blank=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    objects = UserManager()

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


    region = models.CharField(max_length=4, choices=REGION_IN_MOSCOW_CHOICES, null=True, blank=True)
    height = models.PositiveSmallIntegerField(null=True, blank=True)
    age = models.PositiveSmallIntegerField( null=True, blank=True)
    weight = models.PositiveSmallIntegerField( null=True, blank=True)
    def __str__(self) -> str:
        print(self.id, self.username)
        return super().__str__()
# #    profile_picture = models.ImageField()

    # @property
    # def token(self):
    #     return self._generate_jwt()
    
    # def _generate_jwt(self):
    #     exp = datetime.now() + timedelta(days=1)
    #     payload = {
    #         'uid': self.pk,
    #         'exp': int(round(exp.timestamp())),
    #     }
    #     token = encode(payload, SECRET_KEY, "HS256")
    #     return token.decode('utf-8')



class Subscriptions(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name="target_user")
    friend_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name="friend_user")
    

class Message(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sender')
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='recipient')
    message_topic = models.TextField(max_length=200)
    message_text = models.TextField(max_length=2000)
    message_datetime = models.DateTimeField(auto_now_add=datetime.timestamp(timezone.now()))