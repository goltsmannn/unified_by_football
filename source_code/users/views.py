import pdb
from django.urls import reverse_lazy

import rest_framework.viewsets as viewsets
from django.contrib.auth import login, logout
from rest_framework import exceptions, generics
from rest_framework.decorators import action, api_view, authentication_classes
from rest_framework.mixins import (ListModelMixin, RetrieveModelMixin,
                                   UpdateModelMixin)
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from users.forms import UserAlterationForm
from users.models import BlackList, Message, Subscriptions, User
from users.permissions import IsCreatorOrReadOnly
from users.serializer import (BasicUserInfoSerializer, BlackListSerializer,
                              LoginSerializer, MessageSerializer,
                              SubscriptionSerializer, UserRegisterSerializer,
                              UserSerializer)
from rest_framework.permissions import IsAuthenticated
from django.core.mail import send_mail
import IGW.settings as settings
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import default_token_generator

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

    def perform_create(self, serializer):
        super().perform_create(serializer)
        user = User.objects.get(email=serializer.data['email'])

        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.id))
        activation_url = f'verification/{uid}/{token}'
    #    activation_url = reverse_lazy('confirm_email', kwargs={'uidb64': uid, 'token': token})
        try:
            send_mail(
            'Confirm your email',
            f'Click this link to confirm your email: http://127.0.0.1:3000/{activation_url}',
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[serializer.data['email']],
            )
            return Response('sent email')
        except:
            user.delete()
            raise exceptions.ValidationError('Email sending failed')
    


@api_view(['GET'])
def confirm_email(request, uidb64, token):
    try:
        pk = urlsafe_base64_decode(uidb64)
        user = User.objects.get(pk=pk)
    except:
        raise exceptions.NotFound('User not found')
    
    if default_token_generator.check_token(user, token):
        user.is_active = True
        user.save()
        return Response('Email confirmed')
    else:
        raise exceptions.ValidationError('Email confirmation failed')


class LoginUserAPIView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            user = serializer.check_user(request.data)
            login(request, user)
            return Response(serializer.data)
        except:
            raise exceptions.AuthenticationFailed("Credentials error")


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
@authentication_classes([JWTAuthentication])
def retrieve_user_by_token(request):
    return Response(UserSerializer(request.user).data)


@api_view(['POST'])
@authentication_classes([JWTAuthentication])
def update_user_by_token(request):

    user = request.user
    for key, value in request.data.items():
        if value != user.__getattribute__(key) and not (value=="" and user.__getattribute__(key) is None):
            user.__setattr__(key,value)
    user.save()
    return Response(UserSerializer(user).data)


class CreateMessageAPIView(generics.CreateAPIView): #serializer еще там долбаться потом допишу 
    authentication_classes = [JWTAuthentication]

    def post(self, request):
        try:
            recipient = User.objects.get(username=request.data.get('recipient_username'))
            message = Message.objects.create(
                sender=request.user,
                recipient=recipient,
                message_text=request.data.get('message_text'),
                message_topic=request.data.get('message_topic'),
            )
            return Response('Succesfully created message instance')
        except User.DoesNotExist:
            raise exceptions.ValidationError('Recipient user not found while sending the message')


class ListMessagesAPIView(generics.ListAPIView):
    serializer_class = MessageSerializer
    permission_classes = (IsAuthenticated, )
    
    def get_queryset(self):
        filter_by = self.kwargs.get('filter_by')
        if filter_by is None:
            raise exceptions.ValidationError('Filter by is not specified')
        elif filter_by == 'sender':
            return Message.objects.filter(sender=self.kwargs['user_id'])
        elif filter_by == 'recipient':
            return Message.objects.filter(recipient=self.kwargs['user_id'])
        else:
            raise exceptions.ValidationError('Invalid filter by value')
    

@api_view(['GET'])
def retrieve_message(request, message_id):
    try:
        message = Message.objects.get(pk=message_id)
        response = MessageSerializer(message)
        return Response(response.data)
    except Message.DoesNotExist:
        raise exceptions.NotFound('Message not found')
    

class SubscriptionsAPIView(generics.ListCreateAPIView):
    serializer_class = SubscriptionSerializer
    authentication_classes = [JWTAuthentication]
    def get(self, request):
        subscriptions = Subscriptions.objects.filter(user_from=request.user.id)
        response = SubscriptionSerializer(subscriptions, many=True)
        return Response(response.data)
    
    def post(self, request):
        
        try:
            user_from = User.objects.get(pk=request.data.get('user_from_id'))
            user_to = User.objects.get(pk=request.data.get('user_to_id'))
        except User.DoesNotExist:
            raise exceptions.bad_request('Not found user by given id or bad request')
        
        if request.data.get('delete'):
            try:
                Subscriptions.objects.get(user_from=user_from, user_to=user_to).delete()
            except Exception as e:
                raise (e)
        else:
            Subscriptions.objects.create(user_from=user_from, 
                                        user_to=user_to)
            
        subscriptions = Subscriptions.objects.filter(user_from=request.user.id)
        response = SubscriptionSerializer(subscriptions, many=True)       
        return Response(response.data)
    


class BlackListAPIView(generics.ListCreateAPIView):
    serializer_class = BlackListSerializer
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        blacklisted_users = BlackList.objects.filter(user_from=request.user.id)
        response = BlackListSerializer(blacklisted_users, many=True)
        return Response(response.data)
    

    def post(self, request):
        
        try:
            user_from = User.objects.get(pk=request.data.get('user_from_id'))
            user_to = User.objects.get(pk=request.data.get('user_to_id'))
            if user_to.id == user_from.id:
                raise exceptions.bad_request('You can not blacklist yourself')
        except User.DoesNotExist:
            raise exceptions.bad_request('Not found user by given id or bad request')
        
        if request.data.get('delete'):
            try:
                BlackList.objects.get(user_from=user_from, user_to=user_to).delete()
            except Exception as e:
                raise e 
        else:
            BlackList.objects.create(user_from=user_from, 
                                        user_to=user_to)
            
        blacklisted_users = BlackList.objects.filter(user_from=request.user.id)
        response = BlackListSerializer(blacklisted_users, many=True)       
        return Response(response.data)
    





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
    
    
