from ninja import Schema
from pydantic import field_validator
from chat.models import Message, Discussion
from typing import Optional, List
from datetime import datetime


class MessageIn(Schema):
    action: str
    destinataire_id: int
    user: Optional[int] = None 
    texte: Optional[str] = None

class MessageOut(Schema):
    user: int
    texte: str

class UserInfoSchema(Schema):
    id: int
    username: str

class DemandeOut(Schema):
    id: int
    user: UserInfoSchema
    accept: bool

class DiscussionOut(Schema):
    id: int
    user: List[int]
    date: datetime