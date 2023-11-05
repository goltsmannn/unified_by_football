import json
from users.models import BlackList, Message, Subscriptions, User
from django.urls import reverse
from rest_framework.test import APITestCase, APIClient, force_authenticate, APIRequestFactory
from rest_framework import status
from users.serializer import UserSerializer
from map.models import Placemark


class PlacemarksTestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_superuser(username='testuser', email='test@mail.ru', password='123') 
        self.placemark = Placemark.objects.create(
            name='Test Placemark', 
            description='Pitch',
            x=37.7749,
            y=-122.4194)


    def test_placemark_creation(self):
        self.assertIsInstance(self.placemark, Placemark)
        self.assertEqual(self.placemark.name, 'Test Placemark')
        self.assertEqual(self.placemark.x, 37.7749)
        self.assertEqual(self.placemark.y, -122.4194)
        self.assertEqual(self.placemark.description, 'Pitch')

    def test_placemark_defaults(self):
        self.assertEqual(self.placemark.verified, False)
        self.assertEqual(self.placemark.type, 'b')


    def test_user_is_verified(self):
        self.assertEqual(self.user.is_active, True)


    def test_get_placemarks(self):
        url = reverse('map:map-list')
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)


