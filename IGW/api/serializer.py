from rest_framework import serializers
from rest_framework.renderers import JSONRenderer

from map.models import Placemark


# class PlacemarkModel:
#     def __init__(self, x, y, type) -> None:
#         self.x = x 
#         self.y = y
#         self.type = type


class PlacemarkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Placemark
        fields = "__all__"
    
# def encode():
#     model = PlacemarkModel(x=22, y=36, type='b')
#     model_sr = PlacemarkSerializer(model)
#     print(model_sr.data, type(model_sr.data), sep='\n')
#     json = JSONRenderer().render(model_sr.data)