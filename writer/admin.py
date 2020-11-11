from django.contrib import admin
from .models import User, Argument, Thought, Question

# Register your models here.

admin.site.register(User)
admin.site.register(Argument)
admin.site.register(Thought)
admin.site.register(Question)
