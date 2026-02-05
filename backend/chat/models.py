from django.db import models

class Discussion(models.Model):
    # On remplace settings.AUTH_USER_MODEL par la string 'users.User' (ou le nom de ton app.Modèle)
    user = models.ManyToManyField('users.User', related_name="discussions")
    date = models.DateTimeField(auto_now_add=True)


class Message(models.Model):
    discussion = models.ForeignKey(Discussion, on_delete=models.CASCADE, related_name="messages")
    sender = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name="messages_envoyes")
    texte = models.TextField(null=True, blank=True)
    date = models.DateTimeField(auto_now_add=True)
    image = models.ImageField(upload_to='chat_images/', null=True, blank=True)


class Demande_Ami(models.Model):
    user = models.ForeignKey('users.user', on_delete=models.CASCADE, related_name='user')
    destinataire = models.ForeignKey('users.user', on_delete=models.CASCADE, related_name='destinataire')
    accept = models.BooleanField(default=False)


