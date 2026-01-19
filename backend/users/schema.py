from ninja import Schema
from pydantic import field_validator, model_validator, EmailStr, HttpUrl
from django.contrib.auth import get_user_model
from typing import List, Optional


User = get_user_model()

class RegisterInSchema(Schema):
    email: EmailStr
    username: str
    password: str
    password_confirmation: str

    @field_validator('password')
    @classmethod
    def verifier_password(cls, value):
        if len(value) < 10:
            raise ValueError('erreur votre mot de passe doit contenir plus de caractere')
        liste1 = []
        liste2 = []
        liste3 = []
        for i in value:
            if i.isdigit():
                liste1.append(i)
            if i in ['@','#','$','%','&']:
                liste2.append(i)           
            if i.isupper():
                liste3.append(i)

        if len(liste1) < 2 or len(liste2) == 0 or len(liste3) == 0:
            raise ValueError('erreur dans le mdp')
        
        return value
    
    @field_validator('email')
    def verifier_email(cls, value):
        
        if '@' not in value:
            raise ValueError('le format doit mail doit etre valide')
        return value
    

    @model_validator(mode='after')
    def verifier_password_confirm(self):
        if self.password != self.password_confirmation:
            raise ValueError("Les mots de passe ne sont pas identiques.")
        return self
    
#ne pas oublier de faire le registerout 

class LoginIn(Schema):
    email: str
    password: str

    


