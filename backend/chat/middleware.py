from .chatmanager import ChatManager

class ChatManagerMiddleware:
    """
    ASGI middleware to store chat_manager and asyncio event loop in request scope
    """
    def __init__(self, app, chat_manager: ChatManager, loop):
        self.app = app
        self.chat_manager = chat_manager
        self.loop = loop

    async def __call__(self, scope, receive, send):
        scope['chat_manager'] = self.chat_manager
        scope['loop'] = self.loop
        return await self.app(scope, receive, send)
