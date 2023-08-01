from rest_framework import serializers
from rest_framework.renderers import JSONRenderer


# class PlacemarkModel:
#     def __init__(self, x, y, type) -> None:
#         self.x = x 
#         self.y = y
#         self.type = type


class PlacemarkSerializer(serializers.Serializer):
    x = serializers.IntegerField()
    y = serializers.IntegerField()
    type = serializers.CharField(max_length=1)


# def encode():
#     model = PlacemarkModel(x=22, y=36, type='b')
#     model_sr = PlacemarkSerializer(model)
#     print(model_sr.data, type(model_sr.data), sep='\n')
#     json = JSONRenderer().render(model_sr.data)