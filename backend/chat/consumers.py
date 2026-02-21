import json
from channels.generic.websocket import AsyncWebsocketConsumer
from chat.models import Message, Discussion, Demande_Ami
from chat.shema import MessageIn
from django.contrib.auth import get_user_model
from channels.layers import get_channel_layer
from asgiref.sync import sync_to_async

User = get_user_model()

class Messagerie(AsyncWebsocketConsumer):

    async def connect(self):
        self.user = self.scope['user']
        print('user : ', self.user)
        if self.user.is_anonymous:
            print('user anonyme')
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
        action = data_verif.action
        
        destinataire_id = data_verif.destinataire_id
        if not await User.objects.filter(id=destinataire_id).aexists():
            await self.send(text_data=json.dumps({"error": "Utilisateur inconnu"}))         
            return
        
        if action == 'join_discussion':
            discussion_id = data.get('discussion_id')
            self.discussion = f'discussion_{discussion_id}'

            await self.channel_layer.group_add(
                self.discussion,
                self.channel_name
            )
        
        elif action == 'demande_ami':
            deja_amis = await self.user.liste_amis.filter(id=destinataire_id).aexists()
            if not deja_amis:        
                demande_en_cours = await Demande_Ami.objects.filter(
                    user=self.user, 
                    destinataire_id=destinataire_id, 
                    accept=False
                ).aexists()

                if not demande_en_cours:
                    await self.Demander_ami(destinataire_id)
                else:
                    await self.send(text_data=json.dumps({"info": "Demande déjà en attente"}))
            else:
                await self.send(text_data=json.dumps({"info": "Déjà amis"}))

        elif action == 'message':  
        # 2. réception du message(qui vient de mon react)
            destinataire = f"user_{destinataire_id}"
            await self.channel_layer.group_send(
                # 3. jenvoi ce que l'ami a beesoin pour afficher le message
                #    groupe_send => enveloppe (on jette l'enveloppe dans le tuyau)
                #    groupe_send == expediteur !!
                destinataire,
                {
                    "type":'chat_message',
                    "message": data_verif.texte,
                    "sender_id": self.user.id,
                    "sender_name": self.user.username
                }
            )
        user_destinataire = await User.objects.aget(id=destinataire_id)       
        await self.creation_discussion_ou_pas(data_verif, user_destinataire)


    async def Demander_ami(self, destinataire_id):
        demande = await Demande_Ami.objects.acreate(
            user=self.user,
            destinataire_id=destinataire_id, 
            accept=False
        )
        destinataire = f"user_{destinataire_id}"
        await self.channel_layer.group_send(
           
        destinataire,
        {
            "type": "notifier_demande_ami", 
            "message": 'veux tu etre mon amigo',
            "sender_id": self.user.id,
            "demande_id": demande.id
        }
        )
        await self.send(text_data=json.dumps({"success": "Demande envoyée"}))
        return
    

    async def creation_discussion_ou_pas(self, data_verif, user_destinataire):
        discussion = await Discussion.objects.filter(user=self.user).filter(user=user_destinataire).afirst()
        if discussion:
            await Message.objects.acreate(
                discussion=discussion, 
                sender=self.user,
                texte=data_verif.texte
            )
            print('message ajouté a la discussion existante')
        else:

            discussion = await Discussion.objects.acreate()
            await sync_to_async(discussion.user.add)(self.user, user_destinataire)

            await Message.objects.acreate(
                discussion=discussion, 
                sender=self.user,
                texte=data_verif.texte
            )
            print('message créer et discussion créé')

    async def chat_message(self, event):
    # 4. Réception (dans le django de l'autre personne)
        # event contient ce que MOI jai envoyé !!!!!!!!
        # cette fonction est l'autre personne au bout du tuyau
        # chat_message == récepteur !!
        await self.send(text_data=json.dumps({
        # 5. envoie à son react
            "action": "message", 
            "texte": event['message'],
            "sender_id": event['sender_id'],
            "sender_name": event['sender_name']
        }))
    
    async def notifier_demande_ami(self, event):
        await self.send(text_data=json.dumps({
            "action": "nouvelle_demande",
            "message": event["message"],
            "sender_id": event["sender_id"],
            "demande_id": event["demande_id"]
        }))
        
        