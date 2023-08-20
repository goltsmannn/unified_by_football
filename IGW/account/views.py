from typing import Optional
from django.shortcuts import render
from django.http import HttpResponseForbidden
from django.views.generic import DetailView, UpdateView
from django.contrib.auth.models import User# Create your views here.
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from rest_framework import generics
from account.serializer import UserSerializer
from account.permissions import IsCreatorOrReadOnly

def handler403(request, *args, **kwargs):
    return HttpResponseForbidden('<h1>доступа нет</h1>')


class ProfileApiDetail(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (IsCreatorOrReadOnly, )




class ProfileInfoView(LoginRequiredMixin, DetailView):
    template_name = 'account/profile.html'
    model = User
    context_object_name = 'profile'
    raise_exception = True

    def test_func(self) -> bool:
        if self.request.user.is_authenticated and self.request.user.id == self.kwargs['pk']:
            return True
        return False
    
