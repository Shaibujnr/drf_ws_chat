"""
ASGI config for backend project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/howto/deployment/asgi/
"""

import os
import django
import asyncio

from django.core.asgi import get_asgi_application

from channels.routing import ProtocolTypeRouter, URLRouter
from chat.routing import websocket_urlpatterns
from chat.chatmanager import ChatManager
from chat.middleware import ChatManagerMiddleware


os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

django.setup()

from chat.dispatcher import dispatch

# Get the asyncio event loop, this should be provided by our asgi server, uvicorn in this case
loop = asyncio.get_event_loop()

# instantiate the chat manager so we have only one instance that is shared across all requests
chat_manager = ChatManager()

# create the dispatcher task using the asyncio loop.
loop.create_task(dispatch(loop, chat_manager))
application = get_asgi_application()

application = ChatManagerMiddleware(application, chat_manager, loop)

application = ProtocolTypeRouter({
    "http": application,
    "websocket": ChatManagerMiddleware(URLRouter(websocket_urlpatterns), chat_manager, loop),
})
