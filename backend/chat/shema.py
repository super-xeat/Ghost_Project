from ninja import Schema
from pydantic import field_validator
from chat.models import Message, Discussion
from typing import Optional

class MessageIn(Schema):
    action: str
    destinataire_id: int
    user: Optional[int] = None 
    texte: Optional[str] = None

class MessageOut(Schema):
    user: int
    texte: str

class DemandeOut(Schema):
    id: int
    user_id: int
    accept: bool