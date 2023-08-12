from django.shortcuts import render

import sys
sys.path.append(".")

from .serializer import PlacemarkSerializer
from map.models import Placemark
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView


class PlacemarkAPIList(generics.ListCreateAPIView):
    queryset = Placemark.objects.all()
    serializer_class = PlacemarkSerializer

class PlacemarkApiView(APIView):
    def get(self, request):
        data = Placemark.objects.all().prefetch_related('review', 'review__pictures')
        return Response({'title':'bebra', 'placemarks':PlacemarkSerializer(data, many=True).data})
    
    def post(self, request):
        serializer = PlacemarkSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({'placemark': serializer.data})
    
    def put(self, request, *args, **kwargs):
        pk = kwargs.get('pk', None)
        if not pk:
            return Response({'Error': 'Put not allowed'})
        
        try:
            instance = Placemark.objects.get(pk=pk)
        except:
            return Response({'Error': 'Key undefined'})
        
        serializer = PlacemarkSerializer(instance, request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({'placemark': serializer.data})
