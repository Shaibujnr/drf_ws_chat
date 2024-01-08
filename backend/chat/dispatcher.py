import time
import asyncio
from channels.db import database_sync_to_async
from django.db.models import Q
from .models import Message
from .chatmanager import ChatManager

@database_sync_to_async
def dispatch(loop: asyncio.BaseEventLoop, chat_manager: ChatManager):
    """
    Fetch all messages that have not been delivered and dispatch the messages to the
    receiver again.
    """
    while True:
        time.sleep(0.5)
        messages = Message.objects.filter(Q(delivered_on=None)).all().order_by('created_on')
        for message in messages:
            coroutine = chat_manager.send_message_to_receiver(message.to_uuid, message.from_uuid, message.uuid, message.message)
            loop.create_task(coroutine)
