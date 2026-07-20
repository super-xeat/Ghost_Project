from ninja import Router, Form, File
from ninja.files import UploadedFile
from django.conf import settings
from users.schema import RegisterInSchema, LoginIn, LoginOut, ProfileSchema, Userschema, UpdateFormInputSchema
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta
from django.template.loader import render_to_string
from django.contrib.auth.hashers import make_password
from django.shortcuts import redirect
from django.contrib.auth import aauthenticate
from django.utils import timezone
from datetime import timedelta
from asgiref.sync import sync_to_async
from ninja.responses import Response as NinjaResponse
from typing import Optional
from django.http import JsonResponse
from users.authenticate import AuthCookies
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt
from django.http import HttpResponse
from chat.models import Discussion, Message
import jwt
import os
import httpx


User = get_user_model()

auth_provider = AuthCookies()
route_auth = Router(auth=auth_provider)

key = os.getenv('BREVO_KEY')
if key:
    print('brevokey', key)
else:
    print('pas de clé')

@ensure_csrf_cookie
@route_auth.get('csrf/', auth=None)
async def get_csrf_token(request):
    response = NinjaResponse(
        'csrf créer'
    )
    response.set_cookie('csrftoken')
    return response


@route_auth.get('verif_token/', response={200: dict})
def Verif_token(request):
    
    user = request.auth  # ==> on met request.auth et pas request.user car
    # il faut interceepter le middleware
    # request.user = Le système automatique et "standard" de Django (Sessions).
    # request.auth = Le système "sur mesure" de Django Ninja (ton JWT).
    # la méthode authenticate est injecté dans request.auth

    # Pourquoi request.user reste vide ?
    # Django Ninja est conçu pour être léger et ne pas dépendre 
    # obligatoirement du système de session de Django. 
    # Par défaut, il ne remplit pas request.user 
    # car il ne veut pas forcer l'utilisation des middlewares de Django (qui ralentissent un peu l'API).

    # site officiel de Django Ninja:
    # Documentation > Authentication > Custom authentication

    print('user de verif_token:', user) 
    return 200, {
        'id': user.id,
        'username': user.username
        }
  

@route_auth.post('register/', response={201: dict, 400: dict}, auth=None)
async def register(request, data: RegisterInSchema=Form(...), avatar: Optional[UploadedFile]=File(None)):
    
    email_exist = await User.objects.filter(email=data.email).aexists()
    if email_exist:
        return 400, {'message': 'cet email existe deja'}
    
    user_data = data.dict(exclude={'password_confirmation'})
    user_data['password'] = await sync_to_async(make_password)(user_data.pop('password'))
    user = await sync_to_async(User.objects.create)(
        is_active=False, **user_data
    )
    if avatar:
        user.avatar = avatar
        await user.asave()

    token = jwt.encode(
            {
            'user_id': user.id,
            'exp': timezone.now() + timedelta(hours=24)
            },
            settings.SECRET_KEY,
            algorithm='HS256'
        )
            
    context = { 'confirmation_url':f'http://localhost:8000/api/auth/confirm_email/{token}/'}
    message_html = await sync_to_async(render_to_string)('confirm_email.html', context)

    payload = {
        'sender': {"name": "Ghoster", "email":"ghosterprojects@gmail.com"},
        'to':[{'email': user.email}],
        'subject':'Activez votre compte Cine Allo',
        'htmlContent': message_html
    }

    header = {
        "accept":"application/json",
        "content-type":"application/json",
        "api-key": settings.BREVO_KEY
    }
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://api.brevo.com/v3/smtp/email",
            json=payload,
            headers=header
        )
        if response.status_code != 201:
            print(f"Erreur Brevo : {response.text}")
        response.raise_for_status()
    
    return 201, {'success':'Compte creer '}


@route_auth.get('confirm_email/{token}/', response={200: dict, 400: dict}, auth=None)
async def confirmation_mail(request, token: str):
    try:
        decode = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        user = await User.objects.aget(id=decode['user_id'])
        user.is_active = True
        await user.asave()
        return redirect('http://localhost:5173/api/auth/login/')

    except jwt.ExpiredSignatureError:
        return 400, {"error": "Le lien a expire. Veuillez demander un nouvel email."}
    except (jwt.InvalidTokenError, User.DoesNotExist):
        return 400, {"error": "Lien invalide ou utilisateur introuvable."}
    
@csrf_exempt
@route_auth.post('login/', response={201: dict, 401: dict}, auth=None)
async def login(request, data: LoginIn):
    try:
        user = await User.objects.aget(email=data.email)
        print("ceci est le user :", user)
    except User.DoesNotExist:
        return 401, {'erreur': 'email ou mot de passe incorrect'}
    
    authentification = await aauthenticate(request, username=user.username, password=data.password)
    if not authentification:
        return 401, {'error': 'erreur dauthentification'}
    
    access_token = jwt.encode(
        {
            'user_id': authentification.id,
            'exp': timezone.now() + timedelta(days=1),
            'iat': timezone.now()
        },
        settings.SECRET_KEY,
        algorithm='HS256'
    )
    refresh_token = jwt.encode(
        {
            'user_id': authentification.id,
            'exp': timezone.now() + timedelta(days=1),
            'iat': timezone.now()
        },
        settings.SECRET_KEY,
        algorithm='HS256'
    )
    
    response = NinjaResponse({
        'id': user.id,
        'status': user.statut,
        'username': user.username,
        'success': "connecté"
        })
    
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=False,
        samesite=None,
        max_age=3600 * 24
    )
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=False,
        samesite=None,
        max_age=3600 * 24
    )
    return response
    

@route_auth.post('logout/')
async def Logout(request):
    response = HttpResponse({'message':'déconnexion'})
    response.delete_cookie('access_token')
    response.delete_cookie('refresh_token')
    return response


@route_auth.post('refresh/', response={201: dict, 401:dict})
async def Refresh_token(request, data):
    refresh_token = request.COOKIES.get('refresh_token')
    if not refresh_token:
        return 401, {'erreur':'token introuvable'}
    
    decode = jwt.decode(refresh_token, settings.SECRET_KEY, algorithms=['HS256'])
    user = await User.objects.aget(id=decode['user_id'])
    access_token = jwt.encode(
        {
            'user_id': user.id,
            'exp': timezone.now() + timedelta(days=1),
            'iat': timezone.now()
        },
        settings.SECRET_KEY, 
        algorithms=['HS256']
    )
    refresh_token = jwt.encode(
        {
            'user_id': user.id,
            'exp': timezone.now() + timedelta(days=7),
            'iat': timezone.now()
        },
        settings.SECRET_KEY, 
        algorithms=['HS256']
    )
    response = NinjaResponse({'success':'refresh créé'})

    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=True,
        samesite='Lax',
        max_age=3600 * 24
    )
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=True,
        samesite='Lax',
        max_age=3600 * 24
    )
    return response

@route_auth.get('profile/{id}/', response={200: ProfileSchema, 401: dict})
async def Profile(request, id: int):
    try:
        # objectif : sortir les infos du user avec sa liste d'amis (relation M2M)

        # Manager = interface qui permet a django de manipuler les tables en bdd ==> objects par ex

        # user.liste_ami ne fonctionne pas car django est paresseux ==> il renvoie un manager (ManyRelatedManager)
        # ce qui laisse l'opportunité d'affiné la demande avec filter par exemple ...

        # Le cache = comme tu as prefetch_related liste_amis a été charger en avance, il est donc charger en interne
        # dans la mémoire vive(le cache) ==> django evite le sql pour chaque ami

        # async for ==> django est concu pour etre synchrone, dans route asynchrone si on utilise le synchrone cela 
        # déclenche une error(SynchronousOnlyOperation), DONC il faut async for pour que chaque user soit 
        # traité (depuis le cache) sans blockage

        # recuperation de user et préchargement de liste_ami
        user = await User.objects.prefetch_related('liste_amis').aget(id=id)
        # extraction de liste_amis dpeuis le cache avec async for

        amis = []
        async for ami in user.liste_amis.all():
            amis.append({
                "id": ami.id,
                "username": ami.username,
                "statut": ami.statut
            })

        print('ami statut :', amis)
        response = {
            "id": user.id,
            "email": user.email,
            "username": user.username,
            "statut": user.statut,
            "status_discussion": user.status_discussion,
            "liste_amis": amis,
            "avatar": user.avatar
        }
        
        return 200, response
    
    except User.DoesNotExist:
        return 401, {'error': 'Utilisateur inconnu'}


@route_auth.put('modif_profil/{id}/', response={200: dict, 404: dict})
async def modif_profil(request, id: int, data: UpdateFormInputSchema = Form(...), avatar: UploadedFile = File(None)):

    try:
        user = await User.objects.aget(id=id)

        # exclude_unset transforme le shéma en vrai dictionnaire
        # "exclude_unset=True" permet de ne récupérer QUE les champs envoyés par le Front-end
        update_data = data.model_dump(exclude_unset=True)

        if "username" in update_data:
            user.username = update_data["username"]

        if "statut" in update_data:
            user.statut = update_data["statut"]

        if "statut_discussion" in update_data:
            user.statut_discussion = update_data["statut_discussion"]

        if avatar:
            user.avatar = avatar

        if "liste_ami" in update_data:
            user.liste_ami = update_data["liste_ami"]

        await user.asave()

        return 200, {"success": "modification réussi"}
    
    except User.DoesNotExist:
        return 404, {"erreur": "utilisateur introuvable"}


