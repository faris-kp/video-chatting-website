from django.shortcuts import render
from agora_token_builder import RtcTokenBuilder
from django.http import JsonResponse
import os
import random
import time
import json
from .models import RoomMember
from django.views.decorators.csrf import csrf_exempt
# Create your views here.


def getToken(request):
    appId = 'fdace256278a4fbf969f89c72a20ec32'
    appCertificate = os.environ.get('cer')
    print("app",appCertificate)
    channelName =  request.GET.get('channel')
    uid = random.randint(1,230)
    expirationTimeSecond = 3600 * 24
    currentTimeStamp = time.time()
    privilegeExpiredTs = currentTimeStamp + expirationTimeSecond 
    role = 1
    token = RtcTokenBuilder.buildTokenWithUid(appId, appCertificate, channelName, uid, role, privilegeExpiredTs)
    return JsonResponse({'token':token,'uid':uid}, safe=False)



def lobby(request):
    return render(request,'base/lobby.html')

def room(request):
    return render(request,'base/room.html')
    
@csrf_exempt
def createMember(request):
    data = json.loads(request.body)

    member,created = RoomMember.objects.get_or_create(
        name = data['name'],
        uid = data['UID'],
        room_name = data['room_name']

    )
    return JsonResponse({'name':data['name']}, safe=False)