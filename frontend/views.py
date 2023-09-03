from django.shortcuts import render
from django.urls import reverse_lazy

# Create your views here.

def index(request):
    return render(request, 'index.html')