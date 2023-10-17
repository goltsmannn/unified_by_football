import pdb
from typing import List, Optional
from rest_framework import generics
from users.models import User, Message
from users.serializer import UserSerializer, UserRegisterSerializer, LoginSerializer, BasicUserInfoSerializer, MessageSerializer
from users.permissions import IsCreatorOrReadOnly
from users.forms import UserAlterationForm
import rest_framework.viewsets as viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.mixins import RetrieveModelMixin, UpdateModelMixin, ListModelMixin
from rest_framework.views import APIView
from django.contrib.auth import login, logout
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.decorators import api_view
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework import exceptions

class UserViewSet(RetrieveModelMixin, 
                ListModelMixin, 
                viewsets.GenericViewSet):
    
    queryset = User.objects.all()
    serializer_class = UserSerializer
    #permission_classes = (IsCreatorOrReadOnly, )


class ListUserBasicInfo(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = BasicUserInfoSerializer


class RegisterUserAPIView(generics.CreateAPIView):
    serializer_class = UserRegisterSerializer


class LoginUserAPIView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.check_user(request.data)
        login(request, user)
        return Response(serializer.data)


class LogoutUserAPIView(APIView):
    def post(self, request):
        logout(request)


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['email'] = user.email
        return token
    

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


@api_view(['POST'])
def retrieve_user_by_token(request):
    authenticator = JWTAuthentication()
    response = authenticator.authenticate(request)
    if response is None:
        return exceptions.AuthenticationFailed('No user found with given JWT token')
    return Response(UserSerializer(response[0]).data)


@api_view(['POST'])
def update_user_by_token(request):
    authenticator = JWTAuthentication()
    response = authenticator.authenticate(request)
    if response is None:
        raise exceptions.AuthenticationFailed('No user found with given JWT token or token is incorrect')
    pk = response[0].id 
    user = User.objects.get(pk=pk)

    for key, value in request.data.items():
        if value != user.__getattribute__(key) and not (value=="" and user.__getattribute__(key) is None):
            user.__setattr__(key,value)
    user.save()
    return Response(UserSerializer(user).data)


class CreateMessageAPIView(generics.CreateAPIView): #serializer еще там долбаться потом допишу 
    def post(self, request):
        authenticator = JWTAuthentication()
        response = authenticator.authenticate(request=request)
        if response is None:
            raise exceptions.AuthenticationFailed('JWT authentication failed while sending the message')
        user = User.objects.get(pk=response[0].id)
        try:
            recipient = User.objects.get(pk=request.recipient_id)
            message = Message.objects.create(
                sender_id=user,
                recipient_id=recipient,
                message_text=request.message_text,
                message_topic=request.message_topic,
            )
            return Response('Succesfully created message instance')
        except User.DoesNotExist:
            raise exceptions.ValidationError('Recipient user not found while sending the message')


class ListMessagesAPIView(generics.ListAPIView):
    serializer_class = MessageSerializer
    def get_queryset(self):
        return Message.objects.filter(recipient_id=self.kwargs['recipient_id'])

    

@api_view(['GET'])
def retrieve_message(request, message_id):
    try:
        message = Message.objects.get(pk=message_id)
        response = MessageSerializer(message)
        return Response(response.data)
    except Message.DoesNotExist:
        raise exceptions.NotFound('Message not found')
    
    
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
    
    
