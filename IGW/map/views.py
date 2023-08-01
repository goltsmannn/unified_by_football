from django.forms import model_to_dict
from django.http import HttpResponse
from django.shortcuts import render


def main_page(request, *args,):
    return render(request, 'map/main_map.html')


