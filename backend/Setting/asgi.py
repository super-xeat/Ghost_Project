import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from chat.routing import websocket_urlpatterns 

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'nom_de_ton_projet.settings')

application = ProtocolTypeRouter({
    # Pour le HTTP classique
    "http": get_asgi_application(),
    
    # Pour les WebSockets
    "websocket": AuthMiddlewareStack(
        URLRouter(
            websocket_urlpatterns
        )
    ),
})