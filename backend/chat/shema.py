from ninja import Schema
from pydantic import field_validator
from chat.models import Message, Discussion
from typing import Optional, List, Union
from datetime import datetime


class MessageIn(Schema):
    action: str
    # Union car cela peut etre un seul id ou plusieurs (pour les message de groupe)
    destinataire_id: Union[int, List[int]]
    user: Optional[int] = None 
    texte: Optional[str] = None

    
class UserInfoSchema(Schema):
    id: int
    username: str


class MessageOut(Schema):
    sender: UserInfoSchema # <=== !!!!
    texte: Optional[str]
    

class DemandeOut(Schema):
    id: int
    user: UserInfoSchema
    accept: bool

class DiscussionOut(Schema):
    id: int
    user: List[int]
    date: datetime


