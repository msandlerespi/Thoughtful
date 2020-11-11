
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("register", views.register_page, name="register"),
    path("login", views.login_page, name="login"),
    path("logout", views.logout_page, name="logout"),
    path("newThought", views.newThought, name="newThought"),
    path("argument/<str:index>/<int:thoughtId>",
         views.argument, name="argument"),
    path("argument/<str:user>/<str:index>/<int:thoughtId>",
         views.userArgument, name="userArgument"),
    path("thoughts/<str:user>/<int:page>", views.thoughts, name="thoughts"),
    path("questions/<str:order>/<int:page>",
         views.questions, name="questions"),
    path("allThoughts/<int:page>", views.allThoughts, name="allThoughts"),
    # API Routes

    path("check_username/<str:username>",
         views.check_username, name="check_username"),
    path("save", views.save, name="save"),
    path("deleteThought/<int:id>", views.deleteThought, name="deleteThought"),
    path("deleteArg/<int:id>/<str:index>/<int:thoughtId>",
         views.deleteArg, name="deleteArg"),
]
