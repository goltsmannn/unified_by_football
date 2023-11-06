import IGW.settings as settings
import rest_framework.viewsets as viewsets
from django.http import HttpRequest
from django.urls import reverse_lazy
from django.contrib.auth import login, logout
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from map.models import Activity
from rest_framework import exceptions, generics
from rest_framework.decorators import api_view, authentication_classes
from rest_framework.mixins import (ListModelMixin, RetrieveModelMixin)
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from users.models import BlackList, Message, Subscriptions, User, Referals
from users.serializer import (BasicUserInfoSerializer, BlackListSerializer,
                                LoginSerializer, MessageSerializer,
                                SubscriptionSerializer, UserRegisterSerializer,
                                UserSerializer)


class UserViewSet(RetrieveModelMixin,
                    ListModelMixin,
                    viewsets.GenericViewSet):
    """
    Viewset for retrieving a list of users or a single user instance.

    querytset: all users

    Unprotected from unauthorized access (available without login)
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    # permission_classes = (IsCreatorOrReadOnly, )


class ListUserBasicInfo(generics.ListAPIView):
    """
    Viewset for listing basic info about users (username, email, id)

    querytset: all users

    Unprotected from unauthorized access (available without login)
    """
    queryset = User.objects.all()
    serializer_class = BasicUserInfoSerializer


class RegisterUserAPIView(generics.CreateAPIView):
    """
    Endpoint class for registering a user
    Supports only post requests
    """
    serializer_class = UserRegisterSerializer

    def perform_create(self, serializer: UserRegisterSerializer) -> Response:
        """Created a user instance and sends an email with a confirmation link

        Args:
            serializer (UserRegisterSerializer): Serializer for registration fields (username, email, pass1, pass2)
        Raises:
            exceptions.ValidationError: if email sending failed
        Returns:
            Response: HTTP Response
        """
        super().perform_create(serializer)
        user = User.objects.get(email=serializer.validated_data['email'])

        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.id))
        activation_url = f'verification/{uid}/{token}'
        #activation_url = reverse_lazy('users:confirm_email', kwargs={'uidb64': uid, 'token': token})
        
        try:
            send_mail(
                'Confirm your email',
                f'Click this link to confirm your email: http://127.0.0.1:3000/{activation_url}',
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[serializer.validated_data['email']],
            )
            referal = int(serializer.validated_data.get('referal', 1))
            referal_user = User.objects.filter(pk=referal).first()
            if referal_user:
                Referals.objects.create(
                    invite_from=referal_user,
                    invite_to=user
                )
            return Response('sent email')
        except:
            user.delete()
            raise exceptions.ValidationError('Email sending failed')


@api_view(['GET'])
def confirm_email(request, uidb64: str, token: str) -> Response:
    """Endpoint for validating user email and activating the account

    Args:
        request (http request): GET request
        uidb64 (str): encoded user id
        token (str): token for email validation

    Raises:
        exceptions.NotFound: if user is not found
        exceptions.ValidationError: if token is invalid

    Returns:
        Response: Http Response
    """
    try:
        pk = urlsafe_base64_decode(uidb64)
        user = User.objects.get(pk=pk)
    except:
        raise exceptions.NotFound('User not found')

    if default_token_generator.check_token(user, token):
        user.is_active = True
        user.save()
        return Response('Email confirmed')
    
    raise exceptions.ValidationError('Email confirmation failed')


class LoginUserAPIView(APIView):
    """Class for handling user login
    """
    def post(self, request: HttpRequest) -> Response:
        """Handling user login request

        Args:
            request (HttpRequest): POST request with user credentials

        Raises:
            exceptions.AuthenticationFailed: if the credentials are incorrect

        Returns:
            Response: Created user JSON object
        """
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            user = serializer.check_user(serializer.validated_data)
            login(request, user)
            return Response(serializer.data)
        except:
            raise exceptions.AuthenticationFailed("Credentials error")


class LogoutUserAPIView(APIView):
    """
    Class for handling user logout
    """
    authentication_classes = [JWTAuthentication]

    def post(self, request: HttpRequest) -> Response:
        """Logout post request handler

        Args:
            request (HttpRequest): Empty request with JWT Header

        Raises:
            exceptions.AuthenticationFailed: if authentication failed

        Returns:
            Response: logout success message
        """
        try:
            logout(request)
            return Response('Logged out successfully')
        except Exception:
            raise exceptions.AuthenticationFailed("Logout failed")

@api_view(['POST'])
@authentication_classes([JWTAuthentication])
def delete_user(request: HttpRequest) -> Response:
    print(request.user)
    User.objects.get(id=request.user.id).delete()
    return Response('Successfully deleted')

    
    
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Custom token class to add email to the token payload
    """
    @classmethod
    def get_token(cls, user):
        """
        Adding email to the token payload
        """
        token = super().get_token(user)
        token['email'] = user.email
        return token


class CustomTokenObtainPairView(TokenObtainPairView):
    """
    Class for obtaining access and refresh tokens via simplejwt
    """
    serializer_class = CustomTokenObtainPairSerializer


@api_view(['POST'])
@authentication_classes([JWTAuthentication])
def retrieve_user_by_token(request):
    """
    Utility endpoint for retrieving user info by JWT token (reaured for authContext in frontend)
    """
    return Response(UserSerializer(request.user).data)


@api_view(['POST'])
@authentication_classes([JWTAuthentication])
def update_user_by_token(request):
    """
    Endpoint for updating user info when it's altered in the profile settings
    """
    user = request.user
    for key, value in request.data.items():
        if value != user.__getattribute__(key) and not (value == "" and user.__getattribute__(key) is None):
            user.__setattr__(key, value)
    user.save()
    return Response(UserSerializer(user).data)


class CreateMessageAPIView(generics.CreateAPIView):
    """
    Class for handling creation of a single message instance
    """
    authentication_classes = [JWTAuthentication]

    def post(self, request):
        """
        Post request handler for creating a single message instance.
        Message text and topic are required fields.
        Sender is obtained from the request (JWT header).
        Recipient is chosen from the dropdown list on the frontend and is passed in the request.
        """
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
    """Class for handling listing of messages
    """
    serializer_class = MessageSerializer
    permission_classes = (IsAuthenticated,)
    authentication_classes = [JWTAuthentication]

    def get_queryset(self):
        """
        Queryset accepts filter_by parameter from the request and if t's value is 'sender' - returns all messages sent by the user with id from the request,
        if it's value is 'recipient' - returns all messages received by the user with id from the request.
        Messages are sorted by submission date and time in descending order.
        """
        filter_by = self.kwargs.get('filter_by')
        if filter_by is None:
            raise exceptions.ValidationError('Filter by is not specified')
        if filter_by == 'sender':
            return Message.objects.filter(sender=self.kwargs['user_id']).order_by('-message_datetime')
        elif filter_by == 'recipient':
            return Message.objects.filter(recipient=self.kwargs['user_id']).order_by('-message_datetime')
        else:
            raise exceptions.ValidationError('Invalid filter by value')


class DeleteMessageAPIView(generics.DestroyAPIView):
    """
    Class for handling deletion of a single message instance by id
    """
    authentication_classes = [JWTAuthentication]

    def delete(self, request, message_id):
        """Delete request handler for deleting a single message instance by id"""
        try:
            message = Message.objects.get(pk=message_id)
            message.delete()
            return Response('Message deleted successfully')
        except Message.DoesNotExist:
            raise exceptions.NotFound('Message not found')


@api_view(['GET'])
def retrieve_message(request, message_id):
    """
    Endpoint for retrieving a single message instance by id
    """
    try:
        message = Message.objects.get(pk=message_id)
        response = MessageSerializer(message)
        return Response(response.data)
    except Message.DoesNotExist:
        raise exceptions.NotFound('Message not found')


class SubscriptionsAPIView(generics.ListCreateAPIView):
    """
    Class for handling creation and removal of the subscriptions
    """
    serializer_class = SubscriptionSerializer
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        """
        Get request handler for getting all subscriptions (request should contain JWT header)
        """
        subscriptions = Subscriptions.objects.filter(user_from=request.user.id)
        response = SubscriptionSerializer(subscriptions, many=True)
        return Response(response.data)

    def post(self, request):
        """
        Post request handler for adding or removing subscriptions (request should contain JWT header and subscription details: from and to user ids)
        """
        try:
            user_from = User.objects.get(pk=request.data.get('user_from_id'))
            user_to = User.objects.get(pk=request.data.get('user_to_id'))
        except User.DoesNotExist:
            raise exceptions.bad_request('Not found user by given id or bad request')

        if request.data.get('delete'):
            try:
                Subscriptions.objects.get(user_from=user_from, user_to=user_to).delete()
            except Exception as e:
                raise e
        else:
            Subscriptions.objects.create(user_from=user_from,
                                        user_to=user_to)

        subscriptions = Subscriptions.objects.filter(user_from=request.user.id)
        response = SubscriptionSerializer(subscriptions, many=True)
        return Response(response.data)


class BlackListAPIView(generics.ListCreateAPIView):
    """
    Class for handling blacklist operations (addition, removal)
    """

    serializer_class = BlackListSerializer
    authentication_classes = [JWTAuthentication]

    def get(self, request: HttpRequest) -> Response:
        """Get request handler for getting all blacklisted users

        Args:
            request (HttpRequest): request with JWT header

        Returns:
            Response: Serialized list of all blacklisted users
        """
        blacklisted_users = BlackList.objects.filter(user_from=request.user.id)
        response = BlackListSerializer(blacklisted_users, many=True)
        return Response(response.data)

    def post(self, request: HttpRequest) -> Response:
        """Add or remove user from blacklist

        Args:
            request (HttpRequest): Request with JWT header, user id and delete flag

        Raises:
            exceptions.bad_request: if user is trying to blacklist himself or user is not found

        Returns:
            Response: Serialized list of all blacklisted users (updated)
        """
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
            except BaseException as e:
                raise e
        else:
            BlackList.objects.create(user_from=user_from,
                                    user_to=user_to)

        blacklisted_users = BlackList.objects.filter(user_from=request.user.id)
        response = BlackListSerializer(blacklisted_users, many=True)
        return Response(response.data)


@api_view(['GET'])
@authentication_classes([JWTAuthentication])
def subscribed_users(request, placemark_id: int) -> Response:
    """
    Method for getting list of users subscribed to a particular placemark

    Args:
        request: endpoint request
        placemark_id (int): id of the searched placemark

    Returns:
        Response: Serialized list of all users
    """
    id_list = Activity.objects.filter(placemark__id=placemark_id).values_list('user', flat=True)
    users = User.objects.filter(id__in=id_list)
    return Response(BasicUserInfoSerializer(users, many=True).data)






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
