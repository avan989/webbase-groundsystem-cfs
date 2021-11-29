import socket
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from . import ccsds
from . import timeCfs


SAMPLE_NOOP_PACKET = bytearray([
    0x18, 0x82, 0xC0, 0x00, 0x00,
    0x01, 0x00, 0x00])


def sendUdp(address, port, packets):
    udp_socket = socket.socket(family=socket.AF_INET, type=socket.SOCK_DGRAM)

    try:
        udp_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        udp_socket.bind(("", 8001))
    except:
        print("Socket Already Bind")

    udp_socket.sendto(packets, (address, port))

def listenUdp():

    decode_header = ccsds.ccsds_decoder()
    channel_layer = get_channel_layer()
    udp_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    udp_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    udp_socket.bind(("", 1235))
    async_to_sync(channel_layer.group_send)("Global", {"type": "global.message", "text": "Listening On Port 1235"},)
        
    while (True):
        data, address = udp_socket.recvfrom(1024)
        app_name = ""
        message = ""
        if data: 
            (app_name, message, timestamp) = decode_header.decode_header(data)

        if app_name != "":
            send_message = timestamp + "  Application Name: " + app_name + " Message: " + message
            async_to_sync(channel_layer.group_send)("Global", {"type": "global.message", "text": send_message},)


    upd_socket.close()


if __name__ == "__main__":
    # listenUdp()
    sendUdp("172.17.0.1", 1234, SAMPLE_NOOP_PACKET)  # docker container's host ip is 172.17.0.1
