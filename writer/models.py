from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.

class User(AbstractUser):
    morals = models.CharField(max_length=512)
    name = models.CharField(max_length=32, blank=True, null=True)

class Question(models.Model):
    content = models.CharField(max_length=512)
    rank = models.IntegerField(default=0)
    user = models.CharField(max_length=100)

class Thought(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="thoughts")
    smallId = models.IntegerField(default=-1)

class Argument(models.Model):
    procon = models.BooleanField(null=True) # true means pro, false means con
    content = models.CharField(max_length=512)
    sources = models.CharField(max_length=512, blank=True)
    strength = models.FloatField(null=True)
    smallId = models.IntegerField(default=-1)
    origin = models.ForeignKey('self', null=True, on_delete=models.CASCADE, related_name="responses")
    root = models.ForeignKey(Thought, on_delete=models.CASCADE, related_name="arguments")