# chat/consumers.py
import json
import socket
from channels.generic.websocket import AsyncWebsocketConsumer
from . import udp
import _thread


class WebConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        print("Connecting Websocket")
        print(self.channel_name)
        await self.accept()
        await self.channel_layer.group_add("Global", self.channel_name)

        # Inform User Channel Has Been Connected.
        await self.channel_layer.send(
            self.channel_name,
            {"type": "global.message", "text": "Web Socket Connected"},
        )

        _thread.start_new_thread(udp.listenUdp, ())


    async def disconnect(self, close_code):
        pass

    async def global_message(self, event):
        await self.send(text_data=json.dumps({
            'message': event["text"],
        }))

