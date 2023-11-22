import json
from users.models import BlackList, Message, Subscriptions, User, Referals
from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from users.serializer import UserSerializer
from django.contrib.auth import authenticate
from users.serializer import LoginSerializer

class AuthTestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_superuser(username='testuser', email='test@mail.ru', password='123') 
        
    def test_register(self):
        url = reverse('users:register-api')
        data = {
            'email': 'mmgoltsman@mail.ru',
            'username': 'mark',
            'password': '123abc!!',
            'password2': '123abc!!',
        }
        response = self.client.post(url, data)        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        user = User.objects.get(username='mark')
        self.assertEqual('mmgoltsman@mail.ru', user.email) #obligatory field
        self.assertEqual(user.is_active, False) #should be false until email confirmation
        
        referals = Referals.objects.get(invite_to=user)
        self.assertEqual(referals.invite_from.username, 'testuser')



    def test_login(self):
        url = reverse('users:login-api')
        data = {
            'email': self.user.email,
            'password': '123', #т.к. нам нужен пароль не в захэшированном виде
        }       
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    
    def test_logout(self):
        url = reverse('users:logout-api')
        response = self.client.get(url)
        self.client.login(email='test@mail.ru', password='123')
        pk = self.client.session['_auth_user_id']
        user = User.objects.get(pk=pk)
        self.assertEqual(user.email, 'test@mail.ru') #check that we've logged in
        
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        pk = self.client.session.get('_auth_user_id', None)
        self.assertEqual(pk, None)

