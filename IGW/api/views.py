from django.shortcuts import render

import sys
sys.path.append(".")

from .serializer import PlacemarkSerializer
from map.models import Placemark
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView


class PlacemarkApiView(APIView):
    def get(self, request):
        placemarks = Placemark.objects.all().values()
        return Response({'title':'bebra', 'placemarks':PlacemarkSerializer(placemarks, many=True).data})
    
    def post(self, request):
        placemark = Placemark.objects.create(
            x=request.data['x'],
            y=request.data['y'],
        )
        if request.data['type'] is not None:
            placemark.type = request.data['type']
            placemark.save()
        return Response({'placemark':PlacemarkSerializer(placemark).data})