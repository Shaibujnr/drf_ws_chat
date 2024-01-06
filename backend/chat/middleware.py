from .chatmanager import ChatManager

class ChatManagerMiddleware:
    def __init__(self, app, chat_manager: ChatManager):
        self.app = app
        self.chat_manager = chat_manager

    async def __call__(self, scope, receive, send):
        scope['chat_manager'] = self.chat_manager
        return await self.app(scope, receive, send)
