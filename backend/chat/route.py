from ninja import Router
from ninja.responses import Response 
from chat.models import Demande_Ami, Discussion, Message
from django.contrib.auth import get_user_model
from chat.shema import DemandeOut
from typing import List
from asgiref.sync import sync_to_async


route_chat = Router()
User = get_user_model()

# SECTION ==> demande-ami 
@route_chat.get('liste_demande/{id}/', response={200: List[DemandeOut], 404: dict })
async def Liste_demande(request, id: int):
    try:
        user = await User.objects.aget(id=id)
        liste = await sync_to_async(list)(Demande_Ami.objects.filter(destinataire=user.id))
        return 200, liste
    
    except User.DoesNotExist:
        return 404, {'error':'cette user existe pas'}


@route_chat.get('demande/{id1}/{id2}/', response={200: DemandeOut, 404: dict})
async def demande_item(request, id1:int, id2: int):
    try:
        user = await User.objects.aget(id=id1)
        demande = await Demande_Ami.objects.aget(id=id2, user=user.id)
        return 200, demande
    
    except User.DoesNotExist:
        return 404, {'error': 'utilisateur non trouvé'}
    except Demande_Ami.DoesNotExist:
        return 404, {'error':'utilisateur non trouvé'}


@route_chat.put('accept/{id1}/{id2}/{q}/', response={200: dict, 404: dict})
async def accept(request, id1: int, id2: int, q: str):
    try:
        user = await User.objects.aget(id=id1)
        user2 = await User.objects.aget(id=id2)     
        demande = await Demande_Ami.objects.aget(user=user.id, destinataire=user2.id)
        
        if q.lower == 'true':
            await user.liste_amis.aadd(user2)
            await demande.adelete()
            return 200, {'success': 'utilisateur ajouté a la liste des amis'}
        else: 
            await demande.adelete()
            return 200, {'success': 'demande supprimé'}
        
    except (User.DoesNotExist(), Demande_Ami.DoesNotExist()):
        return 404, {'error':'utilisateur introuvable'}

#SECTION ==> recherche-ami


#SECTION ==> discussion message
@route_chat.get('liste_discussion/<int>/')
async def Liste_discussion(request, id: int):
    try:
        user = await User.objects.aget(id=id)
        liste = await Discussion.objects.filter(user=user.id)
        objet = {}
        for char in liste:
            objet[id] = char.get('id')

        return 
    except User.DoesNotExist:
        return Response({'error':'utilisateur introuvable'})
    

@route_chat.get('discussions/<int>/', response={201: dict})
async def Messages(request, id: int):
    try:
        user = await User.objects.aget(id=id)
        user2 = await User.objects.aget(id=id_2)
    except User.DoesNotExist:
        return 
    

