import asyncio
from django.db.models import Q
from uuid import UUID
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from jose import jwt
from jose.exceptions import JWTError
from backend.settings import SECRET_KEY
from .models import Message
from .chatmanager import ChatManager

class AuthApiView(APIView):
    def post(self, request, format=None):
        data = request.data
        user_uuid = data.get('user_uuid')
        if user_uuid is None:
            return Response({"message": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)
        try:
            user_uuid = UUID(user_uuid)
        except ValueError:
            return Response({"message": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)
        chat_manager : ChatManager = request._request.scope['chat_manager']
        if user_uuid not in chat_manager.users:
            return Response({"message": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)
        return Response({"token": jwt.encode({"sub": str(user_uuid)}, SECRET_KEY)}, status=status.HTTP_200_OK)

class MessagesAPIView(APIView):
    def authenticate_request(self, request) -> UUID:
        authorization = request.headers.get("authorization")
        if authorization is None:
            return None
        try:
            token = authorization.split("Bearer")[1].strip()
            payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            user_uuid = UUID(payload["sub"])
            chat_manager : ChatManager = request._request.scope['chat_manager']
            if user_uuid not in chat_manager.users:
                return None
            return user_uuid
        except IndexError:
            return None
        except JWTError:
            return None
        except KeyError:
            return None

    def get(self, request, format=None):
        user_uuid = self.authenticate_request(request)
        if user_uuid is None:
            return Response({"message": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)
        messages = Message.objects.filter(Q(from_uuid=user_uuid) | Q(to_uuid=user_uuid)).all().order_by('created_on')
        return Response([{
            "uuid": str(msg.uuid),
            "from_uuid": str(msg.from_uuid),
            "to_uuid": str(msg.to_uuid),
            "created_on": msg.created_on,
            "is_delivered": msg.delivered_on is not None,
            "is_seen": msg.seen_on is not None,
            "message": msg.message
        } for msg in messages], status=status.HTTP_200_OK)

    def post(self, request, format=None):
        user_uuid = self.authenticate_request(request)
        if user_uuid is None:
            return Response({"message": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)
        payload = request.data
        if "to_uuid" not in payload:
            return Response({"message": "'to_uuid' is required"}, status=status.HTTP_422_UNPROCESSABLE_ENTITY)
        if "message" not in payload:
            return Response({"message": "'message' is required"}, status=status.HTTP_422_UNPROCESSABLE_ENTITY)
        chat_manager : ChatManager = request._request.scope['chat_manager']
        try:
            to_uuid = UUID(payload['to_uuid'])
            if to_uuid not in chat_manager.users:
                return Response({"message": "user not found"}, status=status.HTTP_404_NOT_FOUND)
        except ValueError:
            return Response({"message": "invalid 'to_uuid'"}, status=status.HTTP_422_UNPROCESSABLE_ENTITY)
        if to_uuid == user_uuid:
            return Response({"message": "cannot send message to self"}, status=status.HTTP_400_BAD_REQUEST)
        msg = Message(
            from_uuid=user_uuid,
            to_uuid=to_uuid,
            message=payload['message'],
        )
        msg.save()
        return Response({
            "uuid": str(msg.uuid),
            "from_uuid": str(msg.from_uuid),
            "to_uuid": str(msg.to_uuid),
            "created_on": msg.created_on,
            "is_delivered": msg.delivered_on is not None,
            "is_seen": msg.seen_on is not None,
            "message": msg.message
        }, status=status.HTTP_201_CREATED)
