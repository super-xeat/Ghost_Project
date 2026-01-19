import json
from channels.generic.websocket import AsyncWebsocketConsumer

class Messagerie(AsyncWebsocketConsumer):

    async def connect(self):
        return await super().connect()
    

    async def disconnect(self, code):
        return await super().disconnect(code)
    

    async def receive(self, text_data = None, bytes_data = None):
        return await super().receive(text_data, bytes_data)