from channels.generic.websocket import AsyncWebsocketConsumer
from uuid import UUID
import json

NEW_MESSAGE_EVENT_TYPE = "new_message"
DELIVERED_EVENT_TYPE = "delivered"
SEEN_EVENT_TYPE = "seen"

class ChatManager:
    def __init__(self):
        self.users =  {
            UUID("7e23353f-c0b3-43a1-880b-94f84969ad33"): "User1",
            UUID("8fd045c9-46a0-4493-9341-bb86807c16e4"): "User2"
        }
        self.connections: dict[UUID, AsyncWebsocketConsumer] = {}

    def add_user_connection(self, user_uuid: UUID, websocket: AsyncWebsocketConsumer):
        if user_uuid not in self.users:
            return
        self.connections[user_uuid] = websocket

    def remove_user_connection(self, user_uuid: UUID):
        del self.connections[user_uuid]

    async def send_message_to_receiver(self, receiver_uuid: UUID, sender_uuid: UUID, message_uuid:UUID, message: str):
        connection = self.connections.get(receiver_uuid)
        if connection is None:
            return
        sender_name = self.users.get(sender_uuid)
        await connection.send(text_data=json.dumps({
            "event_type": NEW_MESSAGE_EVENT_TYPE,
            "data": {
                'uuid': str(message_uuid),
                'from_name': sender_name,
                'from_uuid': str(sender_uuid),
                'message': message
            }
        }))

    async def notify_sender_delivered(self, sender_uuid: UUID, message_uuid: UUID):
        connection = self.connections.get(sender_uuid)
        if connection is None:
            return
        await connection.send(text_data=json.dumps(
            {
                "event_type": DELIVERED_EVENT_TYPE,
                "data": {
                    "uuid": str(message_uuid)
                }
            }
        ))

    async def notify_sender_seen(self, sender_uuid: UUID, message_uuid: UUID):
        connection = self.connections.get(sender_uuid)
        if connection is None:
            return
        await connection.send(text_data=json.dumps(
            {
                "event_type": SEEN_EVENT_TYPE,
                "data": {
                    "uuid": str(message_uuid)
                }
            }
        ))