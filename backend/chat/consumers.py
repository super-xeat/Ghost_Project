import json
from channels.generic.websocket import AsyncWebsocketConsumer
from chat.models import Message, Discussion
from shema import MessageIn, MessageOut
from django.contrib.auth import get_user_model
from channels.layers import get_channel_layer
from asgiref.sync import sync_to_async

User = get_user_model()

class Messagerie(AsyncWebsocketConsumer):

    async def connect(self):
        self.user = self.scope['user']
        if self.user.is_anonymous:
            await self.close()
        else:
            self.name = f'user_{self.user.id}'
            await self.channel_layer.group_add(
                self.name,
                self.channel_name
            )
            await self.accept()
    
    async def disconnect(self, code):
        return await super().disconnect(code)
    
    async def receive(self, text_data = None, bytes_data = None):
        data = json.loads(text_data)
        data_verif = MessageIn(**data)

        destinataire_id = data_verif.user.id
        if not await User.objects.filter(id=destinataire_id).aexists():
            await self.send(text_data=json.dumps({"error": "Utilisateur inconnu"}))
            return
        
        destinataire = f"user_{destinataire_id}"
        await self.channel_layer.group_send(
            destinataire,
            {
                "type":'chat_message',
                "message": data_verif.text,
                "sender": self.user.id

            }
        )
        user_destinataire = await User.objects.aget(id=destinataire_id)

        discussion = await Discussion.objects.filter(user=self.user).filter(id=user_destinataire).afirst()
        if discussion:
            await Message.objects.acreate(
                discussion=discussion, 
                sender=self.user,
                texte=data_verif.text
            )
        else:

            discussion = await Discussion.objects.acreate()
            await sync_to_async(discussion.user.add)(self.user, user_destinataire)

            await Message.objects.acreate(
                discussion=discussion, 
                sender=self.user,
                texte=data_verif.text
            )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            "message": event['message'],
            "sender": event['sender']
        }))
        
        