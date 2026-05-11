import json
from channels.generic.websocket import AsyncWebsocketConsumer
from chat.models import Message, Discussion, Demande_Ami
from chat.shema import MessageIn
from django.contrib.auth import get_user_model
from channels.layers import get_channel_layer
from asgiref.sync import sync_to_async

User = get_user_model()

# objectif : 3 action ==> 1. demande d'amis; 2. message normal; 3. chat groupé
# 1.  - vérifier si user existe
#     - vérifier si je suis déja amis avec lui
#     - si non vérifier si je n'ai pas fait une demande en cours
#     - si non envoyer la demande

# 2.  - vérification si discussion en cours avec cette user grace a id unique de la discussion
#     - si oui on rajoute le message (simplement en creant un nouveau message avec l'id de la discussion)
#     - si non on crée une nouvelle discussion avec id1 et id2
#     - vérifier si user existe
#     - envoie du message grace a group_send vers id de l'user


# 3.  - méme système on vérifie si ya pas une discussion en cours avec tout les user id 
#     - si oui on rajoute le message ....
#     - si non crée nouvelle discussion
#     - vérifier que tout les user existe 
#     - envoie des messages grace a chat_message mais dans une boucle 


class Messagerie(AsyncWebsocketConsumer):

    async def connect(self):
        self.user = self.scope['user']
        
        if self.user.is_anonymous:
            print('user anonyme')
            await self.close()
        else:
            self.user_group_name = f'user_{self.user.id}'          
            await self.channel_layer.group_add(
                self.user_group_name,
                self.channel_name
            )
            await self.accept()
    
    async def disconnect(self, code):
        if hasattr(self, 'user_group_name'):
            await self.channel_layer.group_discard(self.user_group_name, self.channel_name)
    
    # text_data ==> contenu du message lié a ws.send(JSON.stringify(message))
    # bytes_data ==> contenu en binaire pour image audio vidéo
    # json.load ==> permet de transformer text_data en dico 
    async def receive(self, text_data = None, bytes_data = None):
        print("texte-data :", text_data)
        data_young = json.loads(text_data)
        data = MessageIn(**data_young)
        action = data.action
        
              
        if action == 'join_discussion':
            discussion_id = data.discussion_id
            self.discussion = f'discussion_{discussion_id}'
        
            await self.channel_layer.group_add(
                self.discussion,
                self.channel_name
            )

        elif action == 'leave_discussion':
            discussion_id = data.discussion_id
            group_name = f'discussion_{discussion_id}'
            await self.channel_layer.group_discard(
                group_name,
                self.channel_name
            )

######################################################################################################
 
        elif action == 'demande_ami':
            destinataire_id = data.destinataire_id
            if not await User.objects.filter(id=destinataire_id).aexists():
                await self.send(text_data=json.dumps({"error": "Utilisateur inconnu"}))         
                return
            
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

#############################################################################################################

        elif action == 'message': 
        # 2. réception du message(qui vient de mon react)     
            print('discussion_message :', data.texte)
            try:
                discussion = await Discussion.objects.aget(id=data.discussion_id)
            except Discussion.DoesNotExist:
                await self.send(text_data=json.dumps({'error': 'discussion inexistante'}))
                return

            await Message.objects.acreate(
            discussion=discussion,
            sender=self.user,
            texte=data.texte
            )
            print('data texte', data.texte)

            groupe_name = f"discussion_{discussion.id}"
            print(f"Envoi vers le groupe : {groupe_name}")
            await self.channel_layer.group_send(
                # 3. jenvoi ce que l'ami a beesoin pour afficher le message
                #    groupe_send => enveloppe (on jette l'enveloppe dans le tuyau)
                #    groupe_send == expediteur !!
                groupe_name,
                {
                    "type":'chat_message',
                    "message": data.texte,
                    "sender_id": self.user.id,
                    "sender_name": self.user.username,
                    "discussion_id": discussion.id
                }
            )
            
###############################################################################################

                
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
            "sender_name": event['sender_name'],
            "discussion_id": event.get('discussion_id'),
        }))
    
    
    async def notifier_demande_ami(self, event):
        await self.send(text_data=json.dumps({
            "action": "nouvelle_demande",
            "message": event["message"],
            "sender_id": event["sender_id"],
            "demande_id": event["demande_id"]
        }))
        
        