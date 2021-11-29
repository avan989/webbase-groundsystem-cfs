import json
import os
from . import ccsds
from . import udp
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

current_path = os.path.dirname(__file__)

# Create your views here.
@csrf_exempt
def udpConnect(request):

    if request.method == "POST":
        data = json.loads(request.body)
        address = data["address"]
        port = data["port"]

        return JsonResponse({"address": address, "port": port})
    else:
        return JsonResponse({'text': 'This is error'})


@csrf_exempt
def test(request):
    channel_layer = get_channel_layer()

    async_to_sync(channel_layer.group_send)("Global", {"type": "global.message", "text": "This is an http request"},)

    return JsonResponse({'text': 'This is test 2'})


@csrf_exempt
def customCommandNoParameter(request):
    channel_layer = get_channel_layer()
    if request.method == "POST":
        header_field_name = ["Primary Version Number",
                             "Packet Type",
                             "Secondary Header",
                             "APID",
                             "Sequence Flag",
                             "Packet Sequence",
                             "Packet Length",
                             "Function Code",
                             "Check Sum"]

        data = json.loads(request.body)
        header_field_value = [0 for x in range(len(header_field_name))]
        address = data["address"]
        port = int(data["port"])
        return_json = {}

        for index, field in enumerate(header_field_name):
            header_field_value[index] = data["data"][field]
            return_json[header_field_name[index]] = data["data"][field]

        print(header_field_value)

        # create headers
        packet = ccsds.createHeaders(header_field_value[0],
                                     header_field_value[1],
                                     header_field_value[2],
                                     header_field_value[3],
                                     header_field_value[4],
                                     header_field_value[5],
                                     header_field_value[6],
                                     header_field_value[7],
                                     header_field_value[8])

        # send
        udp.sendUdp(address, port, packet)
        async_to_sync(channel_layer.group_send)("Global", {"type": "global.message", "text": "This is an http request"},)
        return JsonResponse({
            "success": True,
            "data": json.dumps(return_json)
        })


@csrf_exempt
def noParameterCommand(request):
    json_file = open(current_path + "/commands.json", "r")
    commands_content_json_file = json_file.read()

    # get value from request
    data_from_request = json.loads(request.body)
    app_name = str(data_from_request["appName"])
    command_name = str(data_from_request["commandName"])

    # get value from file
    data_from_file = json.loads(commands_content_json_file)
    dict_of_commands = data_from_file[app_name]['commands']
    parameter_for_command = dict_of_commands[command_name] 
    
    target_address = str(data_from_request["address"]) 
    target_port = int(data_from_request["port"])       
    function_code = int(parameter_for_command["function_code"])
    apid = int(data_from_file[app_name]["apid"])

    # if app name not recongize. Should not happen, frontend is generated
    # from same json file
    if app_name not in data_from_file:
        return JsonResponse({
            "success": False,
            "error_msg": "No AppName Found"
        })

    # if command is not found. Should not happen, fronted is generated from 
    # same json file
    if command_name not in dict_of_commands:
        return JsonResponse({
            "success": False,
            "error_msg": "No command found"
        })

    if request.method == "POST":
        # get data from json file no-parm
        no_parm = data_from_file["no-parm-command"]
        packet_version = no_parm["packet_version"]
        packet_type = no_parm["packet_type"]
        secondary_header = no_parm["secondary_header"]
        sequence_flag = no_parm["sequence_flag"]
        packet_count = no_parm["packet_count"]
        packet_data_length = no_parm["packet_data_length"]
        checksum = no_parm["checksum"]

        # create headers
        packet = ccsds.createHeaders(packet_version,
                                     packet_type,
                                     secondary_header,
                                     apid,
                                     sequence_flag,
                                     packet_count,
                                     packet_data_length,
                                     function_code,
                                     checksum)

        # send
        udp.sendUdp(target_address, target_port, packet)

        return JsonResponse({
            "success": True
        })


@csrf_exempt
def commandAPI(request):
    json_file = open(current_path + "/commands.json", "r")
    commands_content_json_file = json_file.read()

    data = json.loads(commands_content_json_file)
    data.pop("no-parm-command")
 
    return JsonResponse({
        "data": json.dumps(data)
    })


@csrf_exempt
def commandWithParmeters(request):
    json_file = open(current_path + "/commands.json", "r")
    commands_content_json_file = json_file.read()

    # get value from request
    data_from_request = json.loads(request.body)
    app_name = str(data_from_request["appName"])
    command_name = str(data_from_request["commandName"])
    parameter_from_request = data_from_request["parameter"]

    target_address = str(data_from_request["address"]) 
    target_port = int(data_from_request["port"])   

    # data from file 
    data_from_file = json.loads(commands_content_json_file)
    dict_of_commands = data_from_file[app_name]['commands']
    parameter_for_command = dict_of_commands[command_name]

    parameter_type_from_file = parameter_for_command["parameter_type"]
    parameter_name_from_file = parameter_for_command["parameter_name"]
    
    if request.method == "POST":
        # get value for headers
        app = data_from_file[app_name]
        packet_version = app["packet_version"]
        packet_type = app["packet_type"]
        secondary_header = app["secondary_header"]
        sequence_flag = app["sequence_flag"]
        apid = app["apid"]

        packet_count = app["commands"][command_name]["packet_count"]
        packet_data_length = app["commands"][command_name]["packet_data_length"]
        checksum = 0 # calculate
        function_code = app["commands"][command_name]["function_code"]

        # create package
        packet = ccsds.create_packet(parameter_from_request, parameter_name_from_file, parameter_type_from_file)

        # create headers
        pkt_with_header = ccsds.createHeadersWithPacket(packet_version,
                                               packet_type,
                                               secondary_header,
                                               apid,
                                               sequence_flag,
                                               packet_count,
                                               packet_data_length,
                                               function_code,
                                               checksum,
                                               packet)


        udp.sendUdp(target_address, target_port, pkt_with_header)

        return JsonResponse({
            "success": True
        })

