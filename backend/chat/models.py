from django.db import models
from django.conf import settings

class Message(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    texte = models.TextField(null=True, blank=True)
    date = models.DateTimeField(auto_now_add=True)
    image = models.ImageField()