import os
from django.core.asgi import get_asgi_application

# 1. Configurer les settings en premier
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Setting.settings')

# 2. Initialiser l'application HTTP (indispensable avant d'importer le reste)
django_asgi_app = get_asgi_application()

# 3. Maintenant on peut importer Channels et ton code
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
from users.middleware_socket import JWTauthcookieSocket
import chat.routing 

application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket": AllowedHostsOriginValidator(
        JWTauthcookieSocket( # Ta couche de sécurité personnalisée
            URLRouter(
                chat.routing.websocket_urlpatterns
            )
        ) # <-- La virgule ici est plus propre si tu rajoutes des options
    ),
})