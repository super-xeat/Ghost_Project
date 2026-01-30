from django.urls import re_path
from .consumers import Messagerie # Ton consumer

websocket_urlpatterns = [
    re_path(r'ws/chat/$', Messagerie.as_asgi()),
]