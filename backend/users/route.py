from ninja import Router, Form, File
from ninja.files import UploadedFile
from django.conf import settings
from users.schema import RegisterInSchema, LoginIn, LoginOut
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta
from django.template.loader import render_to_string
from django.contrib.auth.hashers import make_password
from django.shortcuts import redirect
from django.contrib.auth import authenticate
from django.utils import timezone
from datetime import timedelta
from asgiref.sync import sync_to_async
from ninja.responses import Response as NinjaResponse
from typing import Optional
from django.http import JsonResponse
import jwt
import os
import httpx


User = get_user_model()

route_auth = Router()

key = os.getenv('BREVO_KEY')
if key:
    print('brevokey', key)
print('pas de clé')

@route_auth.post('register/', response={201: dict, 400: dict})
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
            
    context = { 'confirmation_url':f'http://localhost:8000/auth/confirm_email/{token}/'}
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


@route_auth.get('confirm_email/{token}/', response={200: dict, 400: dict})
async def confirmation_mail(request, token: str):
    try:
        decode = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        user = await User.objects.aget(id=decode['user_id'])
        user.is_active = True
        await user.asave()
        return redirect('http://localhost:8000/auth/login/?status=success')

    except jwt.ExpiredSignatureError:
        return 400, {"error": "Le lien a expire. Veuillez demander un nouvel email."}
    except (jwt.InvalidTokenError, User.DoesNotExist):
        return 400, {"error": "Lien invalide ou utilisateur introuvable."}
    

@route_auth.post('login/', response={201: dict, 401: dict})
async def login(request, data: LoginIn):
    try:
        user = await User.objects.aget(email=data.email)
        print("ceci est le user :", user)
    except User.DoesNotExist:
        return 401, {'error': 'email ou mot de passe incorrect'}
    
    authentification = await sync_to_async(authenticate) (
        request, 
        username=user.username, 
        password=data.password
    )
    if not authentification:
        return 401, {'error': 'email ou mot de passe incorrect'}
    
    access_token = jwt.encode(
        {
            'user_id': authentification.id,
            'exp': timezone.now() + timedelta(minutes=1),
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
        'username': user.username,
        'success connecté': "connecté"})
    
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=False,
        samesite='Lax',
        max_age=3600 * 24
    )
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=False,
        samesite='Lax',
        max_age=3600 * 24
    )
    return response
    

@route_auth.post('logout/')
async def Logout(request):
    response = NinjaResponse({'message':'déconnexion'})
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



