# chat/routing.py
from django.urls import path, include

from . import consumers

websocket_urlpatterns = [
    path('websocket', consumers.WebConsumer.as_asgi()),
]
