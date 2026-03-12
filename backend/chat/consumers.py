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
#     

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
            self.name = f'user_{self.user.id}'          
            await self.channel_layer.group_add(
                self.name,
                self.channel_name
            )
            await self.accept()
    
    async def disconnect(self, code):
        return await super().disconnect(code)
    
    # text_data ==> contenu du message lié a ws.send(JSON.stringify(message))
    # bytes_data ==> contenu en binaire pour image audio vidéo
    # json.load ==> permet de transformer text_data en dico 
    async def receive(self, text_data = None, bytes_data = None):
        data = json.loads(text_data)
        data_verif = MessageIn(**data) #<=== el famoso MessageIn
        action = data_verif.action
        
        
        if action == 'join_discussion':
            discussion_id = data.get('discussion_id')
            self.discussion = f'discussion_{discussion_id}'

            await self.channel_layer.group_add(
                self.discussion,
                self.channel_name
            )

######################################################################################################
 
        elif action == 'demande_ami':
            destinataire_id = data_verif.destinataire_id
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
            destinataire_id = data_verif.destinataire_id
            if not await User.objects.filter(id=destinataire_id).aexists():
                await self.send(text_data=json.dumps({"error": "Utilisateur inconnu"}))         
                return           
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

###############################################################################################

        elif action == 'groupe':
        
                discussion_id = data_verif.discussion_id
                # au lieu d'envoyer un message dans chaque user on va plutot rajouter les message dans la 
                # discussion qui est unique donc si elle existe on rajoute un message
                # sinon un groupe sera créer
                
                verif_discussion = await Discussion.objects.aget(id=discussion_id)
                if not verif_discussion:
                    return 
                else:
                    discussion_groupe = f"user_{verif_discussion}"
                    await self.channel_layer.group_send(
                        discussion_groupe,
                        # problème ==> a cause de chat_message le message risque de s'envoyer au groupe et a la personne individuellement 
                        # dans une autre conversations en cours ou PIRE cela pourrai créer des nouvelle conversation donc création d'un 
                        # groupe (discussion) avant 
                        {
                            "type":'chat_message',
                            "message": data_verif.texte,
                            "sender_id": self.user.id,
                            "sender_name": self.user.username
                        }
                    )
                


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
        
        