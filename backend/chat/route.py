from ninja import Router
from ninja.responses import Response 
from chat.models import Demande_Ami, Discussion, Message
from django.contrib.auth import get_user_model
from chat.shema import DemandeOut, DiscussionOut, MessageOut, UserInfoSchema
from typing import List
from asgiref.sync import sync_to_async

 
route_chat = Router()
User = get_user_model()

# SECTION ==> demande-ami 
@route_chat.get('liste_demande/{id}/', response={200: List[DemandeOut], 404: dict })
async def Liste_demande(request, id: int):
    print('id :', id)
    try:
        user = await User.objects.aget(id=id)
        if not user:
            return 404, {'error': 'user introuvable'}
        print('user :', user)
        liste = await sync_to_async(list)(Demande_Ami.objects.filter(destinataire=user.id).select_related('user'))
        print('liste : ', liste)
        return 200, liste
     
    except Exception as e:
        print(f'Erreur : {e}')
        return 500, {'error': 'Erreur interne du serveur'}



@route_chat.put('accept/{id1}/{id2}/{q}/', response={200: dict, 404: dict})
async def accept(request, id1: int, id2: int, q: str):
    try:
        user = await User.objects.aget(id=id1)
        user2 = await User.objects.aget(id=id2)     
        demande = await Demande_Ami.objects.aget(user=id2, destinataire=id1)
        
        if q.lower() == 'true':          
            await sync_to_async(user.liste_amis.add)(user2)
            await sync_to_async(user2.liste_amis.add)(user)
            await demande.adelete()
            return 200, {'success': 'utilisateur ajouté a la liste des amis'}
        else: 
            await demande.adelete()
            return 200, {'success': 'demande supprimé'}
        
    except (User.DoesNotExist, Demande_Ami.DoesNotExist):
        return 404, {'error':'utilisateur introuvable'}


@route_chat.delete('supprimer_ami/{id1}/{id2}/', response={201: dict, 404: dict})
async def supprimer_ami(request, id1: int, id2: int):
    try:
        user = await User.objects.aget(id=id1)
        print('user', user)
        user2 = await User.objects.aget(id=id2)
        print('user2', user2)
 
        await sync_to_async(user.liste_amis.remove)(user2)

        return 201, {'success':'cest bon'}
    except User.DoesNotExist:
        return 404, {'error':'impossible de supprimer'}



@route_chat.get('liste_discussion/{id}/', response={200: List[DiscussionOut], 404: dict})
async def Liste_discussion(request, id: int):
    try:
        user = await User.objects.aget(id=id)
        print('user de liste_discussion:', user)
        discussion = await sync_to_async(list)(Discussion.objects.filter(user=user))
        result = []
        for i in discussion:
            users = await sync_to_async(list)(i.user.all())
            result.append({
                "id": i.id,
                "user": [k.id for k in users],
                'date': i.date
            })
        
        print('result :', result)
        return 200, result
        
    except User.DoesNotExist:
        return Response({'error':'utilisateur introuvable'})
    

@route_chat.get('discussion/{discussion_id}/', response={200: List[MessageOut], 400: dict})
async def discussion(request, discussion_id: int):
    try:
        discussion = await Discussion.objects.prefetch_related('user').aget(id=discussion_id)
        participants = [u async for u in discussion.user.all()] #au cas jaurai besoin des participants
        
        messages = Message.objects.filter(
            discussion=discussion_id,
        ).select_related('sender')
        liste_message = [msg async for msg in messages]
  
        return 200, liste_message
        
    except Discussion.DoesNotExist:
        return 400, {'error':'discussion introuvable'}


@route_chat.get('trouver_discussion/{user_id}/{user_id2}/', response={200:dict, 400: dict})
async def trouver_discussion(request, user_id: int, user_id2: int):
    try:
    # filter, exclude ou order_by se contente de retourner un queryset
    # si on veut les manipuler il faut ajouter un all ou get ou first
    # Donc on prépare le queryset et on appelle ce qu'on veut de manière async
        discussion = await Discussion.objects.filter(user=user_id).filter(user=user_id2).aget()
        return 200, {'id': discussion.id}
    
    except (User.DoesNotExist, Discussion.DoesNotExist):
        return 400, {'error': 'discussion introuvable'}


# Section créer une conversation groupé
# Objectif : créer une conversation visible par tout les amis de ma liste_amis

@route_chat.get('liste_amis/{user_id}/', response={200: List[UserInfoSchema], 404: dict})
async def liste_ami(request, user_id: int):
    try:
        liste = await User.objects.prefetch_related('liste_amis').aget(id=user_id)
        print('liste :', liste)
        liste_ami = [ami async for ami in liste.liste_amis.all()]

        return 200, liste_ami
    except User.DoesNotExist:
        return 404, {'error': 'user introuvable'}


# créer un groupe
@route_chat.post('creer_groupe/', response={200: dict, 404: dict})
async def creer_groupe(request, data:List[int]):  
    # transformation en chiffre 
    print('data :', data)
    if len(data) > 5:
        return 404, {'error': 'nombre de user trop élevé'}
    # si liste <= 5
    else:
        liste_user = []
        # query_set = [15, 05, 30]
        for char in data:
            user = await User.objects.aget(id=int(char))
            liste_user.append(user)

        discussion = await Discussion.objects.acreate()
        for user in liste_user:
            await sync_to_async(discussion.user.add)(user)
        
        return 200, {'discussion_id': discussion.id }

# !!!!!!!!!! crée une variable pour vérifier si discussion existe 
