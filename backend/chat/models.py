from django.db import models
from django.conf import settings


class Discussion(models.Model):
    user = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name="discussions")
    date = models.DateTimeField(auto_now_add=True)


class Message(models.Model):
    discussion = models.ForeignKey(Discussion, on_delete=models.CASCADE, related_name="messages")
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="messages_envoyes")
    texte = models.TextField(null=True, blank=True)
    date = models.DateTimeField(auto_now_add=True)
    image = models.ImageField()


