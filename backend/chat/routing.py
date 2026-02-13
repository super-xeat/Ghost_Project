from django.urls import re_path
from chat.consumers import Messagerie 

websocket_urlpatterns = [
    re_path(r'ws/chat/$', Messagerie.as_asgi()),
]