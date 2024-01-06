"""
ASGI config for backend project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application

from channels.routing import ProtocolTypeRouter, URLRouter
from chat.routing import websocket_urlpatterns
from chat.chatmanager import ChatManager
from chat.middleware import ChatManagerMiddleware

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')



chat_manager = ChatManager()

application = get_asgi_application()
application = ChatManagerMiddleware(application, chat_manager)

application = ProtocolTypeRouter({
    "http": application,
    "websocket": ChatManagerMiddleware(URLRouter(websocket_urlpatterns), chat_manager),
})
