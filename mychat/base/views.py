from django.shortcuts import render

# Create your views here.

def lobby(requsest):
    return render(requsest,'base/lobby.html')

def room(requsest):
    return render(requsest,'base/room.html')
    