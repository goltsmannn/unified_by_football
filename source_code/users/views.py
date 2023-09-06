import pdb
from typing import List, Optional
from django.shortcuts import get_object_or_404, render, HttpResponse
from django.http import HttpResponseForbidden
from django.views.generic import DetailView, UpdateView
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from rest_framework import generics
from users.models import User
from users.serializer import UserSerializer
from users.permissions import IsCreatorOrReadOnly
from users.forms import UserAlterationForm
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response


class UserViewSet(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (IsCreatorOrReadOnly, )



# class ProfileApiDetail(generics.RetrieveUpdateAPIView):
#     queryset = Profile.objects.all()
#     serializer_class = ProfileSerializer
#     permission_classes = (IsCreatorOrReadOnly, )

    
#     def dispatch(self, request, *args, **kwargs):
#         self.args = args
#         self.kwargs = kwargs
#         request = self.initialize_request(request, *args, **kwargs)
#         self.request = request
#         self.headers = self.default_response_headers  # deprecate?
#         try:
#             self.initial(request, *args, **kwargs)


#             if request.method == 'POST':
#                 if request.POST.get('_method', '').lower() == 'put':
#                     response = self.put(request, *args, **kwargs)
#             else:
#                 if request.method.lower() in self.http_method_names:
#                     handler = getattr(self, request.method.lower(),
#                                         self.http_method_not_allowed)
#                 else:
#                     handler = self.http_method_not_allowed

#             response = handler(request, *args, **kwargs)

#         except Exception as exc:
#             response = self.handle_exception(exc)

#         self.response = self.finalize_response(request, response, *args, **kwargs)
#         return self.response


# def profile_view(request, pk):
#     requested_user = get_object_or_404(User, pk=pk)
#     user = request.user
#     creator_profile = 'account/profile_edit.html'
#     viewer_profile = 'account/profile_view.html'
#     error_profile = 'account/error403.html'

#     if user.is_authenticated and user.id == requested_user.id:
#         context = {
#             'form': AccountAlterationForm,
#         }
#         return render(request, creator_profile, context)
#     else:
#         if user.is_authenticated:
#             context = {
#                 'profile': requested_user.profile,
#             }
#             return render(request, viewer_profile, context)
#         else:
#             return render(request, error_profile, status=401)
    
    
