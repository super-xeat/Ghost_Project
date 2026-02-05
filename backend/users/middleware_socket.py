import jwt
from django.conf import settings
from django.contrib.auth.models import AnonymousUser
from django.contrib.auth import get_user_model
from channels.db import database_sync_to_async
from http.cookies import SimpleCookie
from channels.middleware import BaseMiddleware

User = get_user_model()

@database_sync_to_async
def recup_user(user_id):
    try:
        return User.objects.get(id=user_id)
    except User.DoesNotExist:
        return AnonymousUser()
    

class JWTauthcookieSocket(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        try:
            header = dict(scope.get('headers', []))
            cookie = header.get(b'cookie', b'').decode()

            cookie_parser = SimpleCookie()
            cookie_parser.load(cookie)

            token = cookie_parser.get('access_token')
            if token:
                final = token.value
                decode = jwt.decode(
                    final,
                    settings.SECRET_KEY,
                    algorithms=['HS256']
                )
                scope['user'] = await recup_user(decode['user_id'])
            else:
                scope['user'] = AnonymousUser()

        except (jwt.ExpiredSignatureError, jwt.DecodeError, KeyError, Exception):
            scope['user'] = AnonymousUser()
        
        return await super().__call__(scope, receive, send)
