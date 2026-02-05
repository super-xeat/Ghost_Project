from django.db import models
from django.contrib.auth.models import AbstractUser
from chat.models import Message

class User(AbstractUser):
    STATUS_CHOICES = [
        ('En ligne', 'en ligne'),
        ('Hors ligne', 'hors ligne')
    ]
 
    DISCUSSION_CHOICE = [
        ('hote', 'hote'),
        ('invité', 'invite')
    ]
    email = models.EmailField(null=False, unique=True, blank=True)
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    username = models.CharField(max_length=20, unique=True)

    statut = models.CharField(choices=STATUS_CHOICES, default='hors ligne')

    status_discussion = models.CharField(choices=DISCUSSION_CHOICE, default='hote')
    liste_amis = models.ManyToManyField('self', blank=True)