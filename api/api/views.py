import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
#from .redis_connect import connect_redis, pub_redis


# Create your views here.
@csrf_exempt
def udpConnect(request):

    if request.method == "POST":
        data = json.loads(request.body)
        address = data["address"]
        port = data["port"]

    #    connect_redis("This is a test")

        return JsonResponse({"address": address, "port": port})
    else:
        return JsonResponse({'text': 'This is error'})


def test(request):
    return JsonResponse({'text': 'This is test'})
