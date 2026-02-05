
from ninja.security import APIKeyCookie
from django.conf import settings
from django.contrib.auth import get_user_model
import jwt

User = get_user_model()

class AuthCookies(APIKeyCookie):
    async def __call__(self, request):
        cookie = request.COOKIES.get('access_token')
        try:
            decode = jwt.decode(
                cookie,
                settings.SECRET_KEY,
                algorithms=['HS256']
            )
            user = await User.objects.aget(id=decode['user_id'])
            return user
        except (jwt.InvalidTokenError, User.DoesNotExist):
            return None