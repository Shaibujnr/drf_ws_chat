import json
from urllib.parse import parse_qs
from channels.generic.websocket import AsyncWebsocketConsumer
from jose import jwt
from jose.exceptions import JWTError
from uuid import UUID
from .chatmanager import ChatManager
from backend.settings import SECRET_KEY

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # TODO authenticate before accepting
        parsed_query_string = parse_qs(self.scope["query_string"])
        token = parsed_query_string.get(b"token")
        if token is None:
            return await self.close()
        token = token[0].decode("utf-8")
        chat_manager: ChatManager = self.scope['chat_manager']
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            user_uuid = UUID(payload["sub"])
            if user_uuid not in chat_manager.users:
                return await self.close()
            self.scope['user_uuid'] = user_uuid
            await self.accept()
            chat_manager.add_user_connection(user_uuid, self)
        except IndexError:
            return await self.close()
        except JWTError:
            return await self.close()
        except KeyError:
            return await self.close()
        
    async def disconnect(self, close_code):
        user_uuid: UUID = self.scope['user_uuid']
        chat_manager: ChatManager = self.scope['chat_manager']
        chat_manager.remove_user_connection(user_uuid)

    async def receive(self, text_data):
        chat_manager: ChatManager = self.scope['chat_manager']
        text_data_json = json.loads(text_data)
        if text_data_json.get('event_type') == "INFO":
            await self.send(text_data=json.dumps({
                'event_type': "INFO",
                'message': {
                    "user_uuid": str(self.scope['user_uuid']),
                    "user_name": str(chat_manager.users[self.scope['user_uuid']])
                }
            }))
