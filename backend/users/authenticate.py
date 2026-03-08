
from ninja.security import APIKeyCookie
from django.conf import settings
from django.contrib.auth import get_user_model
import jwt

User = get_user_model()

class AuthCookies(APIKeyCookie):
    param_name: str = "access_token"
    
    async def authenticate(self, request, key):
        if not key:
            return None
        print('key :', key)
        try:
            decode = jwt.decode(
                key,
                settings.SECRET_KEY,
                algorithms=['HS256']
            )
            user = await User.objects.aget(id=decode['user_id'])
            print('user cookie :', user)
            return user
        except (jwt.InvalidTokenError, User.DoesNotExist):
            return None