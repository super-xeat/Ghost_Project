from ninja import Schema
from pydantic import field_validator
from chat.models import Message, Discussion


class MessageIn(Schema):
    user: int
    texte: str


class MessageOut(Schema):
    user: int
    texte: str