from ninja import NinjaAPI
from users.route import route_auth
from chat.route import route_chat

api = NinjaAPI() 


api.add_router("auth/", route_auth)
api.add_router("chat/", route_chat)