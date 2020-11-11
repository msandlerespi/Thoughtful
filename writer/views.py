import json
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator

from .models import User, Argument, Thought, Question

# Create your views here.


def index(request):
    return render(request, "writer/index.html")


def login_page(request):
    if request.method == "POST":
        username = request.POST["email"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "writer/login.html", {
                "message": "Invalid username and/or password."
            })
    return render(request, "writer/login.html")


def logout_page(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register_page(request):
    if request.method == "POST":
        name = request.POST["name"]
        email = request.POST["email"]
        password = request.POST["password"]
        morals = request.POST["morals"]
        if not (len(name) == 0 or len(email) < 5 or len(password) < 8 or len(morals) == 0 or not '@' in email or not '.' in email or password.upper() == password or password.lower() == password or User.objects.filter(username=email).count() > 0):
            user = User.objects.create_user(email, email, password)
            user.name = name
            user.morals = morals
            user.save()
            login(request, user)
            return HttpResponseRedirect(reverse('index'))
        else:
            if User.objects.filter(username=email).count() > 0:
                return render(request, "writer/register.html", {
                    "message": "email already registered to an account"
                })
            return render(request, "writer/register.html", {
                "message": "invalid username or password"
            })
    return render(request, "writer/register.html")


def newThought(request):
    if request.method == "POST":
        q = request.POST["question"]
        temp = request.user.thoughts.all()
        newId = len(temp)
        for i in range(len(temp)):
            boo = True
            for t in temp:
                if t.smallId == i:
                    boo = False
            if boo:
                newId = i
                break

        newThought = Thought(
            user=request.user,
            smallId=newId
        )
        newThought.save()
        newArg = Argument(
            procon=None,
            content=q,
            strength=None,
            smallId=0,
            origin=None,
            root=newThought
        )
        newArg.save()
        if Question.objects.filter(content=q).count() == 0:
            newQuestion = Question(
                content=q,
                rank=0,
                user=request.user
            )
            newQuestion.save()
        else:
            question = Question.objects.get(content=q)
            question.rank += 1
            question.save()
        return HttpResponseRedirect("/argument/ /"+str(newId))


# will rename to user thoughts and make an all thoughts one too
def thoughts(request, user, page):
    user = User.objects.get(username=user)
    temp = user.thoughts.all()
    userThoughts = []
    for t in temp:
        userThoughts.append({
            "id": t.smallId,
            "value": t.arguments.all().get(origin=None).content,
        })
    userThoughts = Paginator(userThoughts, 10)
    user = {"username": user.username,
            "name": user.name, "morals": user.morals}
    return render(request, "writer/explore.html", {
        "thoughts": userThoughts.page(page),
        "currentUser": user,
        "pagePlus": page + 1 if page + 1 <= userThoughts.num_pages else 0,
        "pageMinus": page - 1,
    })


def allThoughts(request, page):
    temp = Thought.objects.all()
    usersThoughts = []
    for t in temp:
        usersThoughts.append({
            "id": t.smallId,
            "value": t.arguments.all().get(origin=None).content,
            "user": t.user.username,
            "page": page
        })
    usersThoughts = Paginator(usersThoughts, 10)
    return render(request, "writer/explore.html", {
        "thoughts": usersThoughts.page(page),
        "pagePlus": page + 1 if page + 1 <= usersThoughts.num_pages else 0,
        "pageMinus": page - 1,
    })


def questions(request, order, page):
    # TODO: also paginator it
    qs = []
    qObjects = Question.objects.all()
    for q in qObjects:
        if(order == 'oldest'):
            qs.append(q.content)
        elif(order == 'recent'):
            qs.insert(0, q.content)
        elif(order == 'rank'):
            i = 0
            for q2 in qs:
                if q2["rank"] < q.rank:
                    break
                i += 1
            qs.insert(i, {"content": q.content, "rank": q.rank})
    if order == "rank":
        for i in range(len(qs)):
            qs[i] = qs[i]["content"]
    qs = Paginator(qs, 10)

    return render(request, "writer/explore.html", {
        "questions": qs.page(page),
        "pagePlus": page + 1 if page + 1 <= qs.num_pages else 0,
        "pageMinus": page - 1,
    })


def argument(request, index, thoughtId):
    arg = request.user.thoughts.all().get(
        smallId=thoughtId).arguments.all().get(origin=None)
    if index != " ":
        indeces = index.split(" ")
        map(int, indeces)
        for i in indeces:
            arg = arg.responses.all().get(smallId=i)
    args = []
    for a in arg.responses.all():
        if a.procon:
            left = 1
        else:
            left = 0
        args.append({
            "id": a.smallId,
            "top": a.strength,
            "left": left,
            "procon": a.procon,
            "content": a.content
        })
    if(index == " "):
        return render(request, "writer/writer.html", {
            "thoughtId": thoughtId,
            "main": arg.content,
            "args": args,
            "isUser": True
        })
    return render(request, "writer/writer.html", {
        "index": index,
        "thoughtId": thoughtId,
        "main": arg.content,
        "args": args,
        "isUser": True
    })


def userArgument(request, user, index, thoughtId):
    arg = User.objects.get(username=user).thoughts.all().get(
        smallId=thoughtId).arguments.all().get(origin=None)
    if index != " ":
        indeces = index.split(" ")
        map(int, indeces)
        for i in indeces:
            arg = arg.responses.all().get(smallId=i)
            print(i)
    args = []
    for a in arg.responses.all():
        if a.procon:
            left = 1
        else:
            left = 0
        args.append({
            "id": a.smallId,
            "top": a.strength,
            "left": left,
            "procon": a.procon,
            "content": a.content
        })
    if(index == " "):
        return render(request, "writer/writer.html", {
            "thoughtId": thoughtId,
            "main": arg.content,
            "args": args,
            "currentUser": user,
        })
    return render(request, "writer/writer.html", {
        "index": index,
        "thoughtId": thoughtId,
        "main": arg.content,
        "args": args,
        "currentUser": user,
    })

# API routes


def check_username(request, username):
    return JsonResponse(User.objects.filter(username=username).count() == 0, safe=False)


def save(request):
    if(request.method == "PUT"):
        # essentially, the issue is that, when you delete something in the database, it cascades, so you delete the children
        # i think im gonna match ids and make it so the js has a blacklist, and whenever something is deleted it goes on the blacklist until the page is saved.
        # i can easily delete the blacklist because save is a function
        data = json.loads(request.body)
        thoughtId = data.get("thoughtId", "")
        index = data.get("index", "")
        arguments = data.get("arguments", "")
        argument = request.user.thoughts.all().get(
            smallId=thoughtId).arguments.all().get(origin=None)
        for i in index:
            argument = argument.responses.all().get(smallId=i)
        argsLeft = argument.responses.all()
        for arg in arguments:
            print(arg)
            oldArg = argsLeft.filter(smallId=arg["smallId"])
            if oldArg.count() == 1:
                oldArg = oldArg.get(smallId=arg["smallId"])
                oldArg.content = arg["content"]
                oldArg.save()
                argsLeft = argsLeft.exclude(smallId=arg["smallId"])
            elif oldArg.count() == 0:
                newArg = Argument(
                    procon=arg["procon"],
                    content=arg["content"],
                    strength=arg["strength"],
                    smallId=arg["smallId"],
                    origin=argument,
                    root=argument.root
                )
                newArg.save()
                argsLeft = argsLeft.exclude(smallId=arg["smallId"])
            else:
                return JsonResponse({"error": "Multiple arguments with the same ID"}, status=400)
        print(argsLeft)
        argsLeft.delete()
        return JsonResponse({"message": "Argument's responses saved"}, status=200)
    return JsonResponse({"error": "Must be PUT request"}, status=400)


def deleteThought(request, id):
    if request.method == 'DELETE':
        request.user.thoughts.get(smallId=id).delete()
        return JsonResponse({"message": "Thought successfully deleted"}, status=200)
    return JsonResponse({"error": "Must be DELETE request"}, status=400)


def deleteArg(request, id, index, thoughtId):
    if request.method == "DELETE":
        print('hi')
        arg = request.user.thoughts.all().get(
            smallId=thoughtId).arguments.all().get(origin=None)
        if index != " ":
            indeces = index.split(" ")
            map(int, indeces)
            for i in indeces:
                arg = arg.responses.all().get(smallId=i)
        arg.responses.get(smallId=id).delete()
        return JsonResponse({"message": "Argument successfully deleted"}, status=200)
    return JsonResponse({"error": "Must be DELETE request"}, status=400)
