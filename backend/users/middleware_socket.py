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
                data_brute = jwt.decode(final, options={"verify_signature": False})
                
                clean_key = str(settings.SECRET_KEY).strip()
                decode = jwt.decode(final, clean_key, algorithms=['HS256'])
                
                scope['user'] = await recup_user(decode['user_id'])
                print('scope user existant :', scope['user'])
            else:
                scope['user'] = AnonymousUser()
                print('scope user anonyme :', scope['user'])

        except (jwt.ExpiredSignatureError, jwt.DecodeError, KeyError):
            scope['user'] = AnonymousUser()
        except jwt.InvalidSignatureError:
            print("STOP : La signature est invalide. La clé utilisée au login n'est pas celle du middleware.")
        except Exception as e:
            import traceback
            print("CRASH LOG :")
            print(traceback.format_exc())
        return await super().__call__(scope, receive, send)
