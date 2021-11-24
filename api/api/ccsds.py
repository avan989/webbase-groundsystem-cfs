import numpy as np
from struct import *
from . import udp
import datetime


class ccsds_decoder():
    """
        Primary packet            Start Bytes       Type
            - Stream ID                0           uint16
            - Sequence                 2           uint16
            - Length                   4           uint16
        
        Secondary Header  
            - seconds                  6           uint32
            - subseconds               10          uint16

        Packet ID
            - AppName[20]              12          utf-8
            - Event ID                 32          uint16
            - EventType                34          uint16     (1 - Debug, 2- Informational, 3 - Error, 4 - Critical)
            - Spacecraft ID            36          uint32
            - Processor ID             40          uint32

        Message
            - Message[122]             44          utf-8
            - Spare                    166         uint8
            - Spare                    167         uint8
    """
    def __init__(self):
        pass

    def decode_header(self, pkt):

        # big Edian
        stream_id = unpack(">H", pkt[0:2])
        sequence = unpack(">H", pkt[2:4])
        length = unpack(">H", pkt[4:6])

        # secondary header
        offset = 4
        start_bit = 6 
        seconds = unpack(">l", pkt[start_bit:start_bit + 4])[0]

        start_bit += 4
        subseconds =  unpack(">H", pkt[start_bit:start_bit + 2])[0]

        start_bit += 2 + offset
        app_name = pkt[start_bit: start_bit + 10].decode("utf-8", "ignore").split("\0")[0]

        start_bit += 20
        event_id = int.from_bytes(pkt[start_bit: start_bit + 2], byteorder = "little")

        start_bit += 2
        event_type = int.from_bytes(pkt[start_bit: start_bit + 2], byteorder = "little")

        start_bit += 2
        # spacecraft id 

        start_bit += 4
        # processor id

        start_bit += 4
        message = pkt[start_bit:start_bit + 122].decode("utf-8", "ignore").split("\0")[0]

        timestamp = datetime.datetime.fromtimestamp(seconds).strftime('%Y-%m-%d %H:%M:%S') # to-do, fix time stamp

        #print(event_type)
        #print(event_id)
        print(app_name)
        #print(message)
        print(timestamp)
        #print(seconds)
        print(subseconds)

        if event_type > 1 and event_type <= 4:
            return (app_name, message, timestamp)
        
        return ("", "", "")


class ccsds_pkt():

    def __init__(self, parameters_value, parameters_name, parameters_type):
        self.parameters_name = parameters_name
        self.parameters_value = parameters_value
        self.parameters_type = parameters_type

    def create_pkt(self):
        packet = bytearray(0)
        if len(self.parameters_value) != len(self.parameters_type):
            return -1

        for index, name in enumerate(self.parameters_name):
            value = self.parameters_value[name]
            value_type = self.parameters_type[index]

            if value_type == "utf-8":
                packet += value.encode('utf-8')

            # to-do handle more type


        return packet


class ccsds_headers():
    """
        primary header:
            - 3  bits: packet version number
            - 1  bit : packet type
            - 1  bit : secondary header flag
            - 11 bits: APID
            - 2  bit : sequence flag
            - 14 bits: packet sequence
            - 16 bits: packet length (total length - 7)
    """
    checksum = 0
    fields = [0 for x in range(7)]
    mask = [0x7, 0x1, 0x1, 0x7FF, 0x3, 0x3FFF, 0xFFFF]
    shift = [3, 1, 1, 11, 2, 14, 16]
    primary_header = np.array([0, 0, 0], dtype="uint16")
    secondary_header = np.array([0], dtype="uint16")

    def __init__(self,
                 packet_version,
                 packet_type,
                 secondary_header,
                 apid,
                 sequence_flag,
                 packet_count,
                 packet_data_length,
                 function_code,
                 checksum):

        self.fields[0] = packet_version
        self.fields[1] = packet_type
        self.fields[2] = secondary_header
        self.fields[3] = apid
        self.fields[4] = sequence_flag
        self.fields[5] = packet_count
        self.fields[6] = packet_data_length

        self.create_primary_header()
        self.create_secondary_header(function_code, checksum)

    def create_primary_header(self):
        for index, field in enumerate(self.fields):
            if (index < 4):
                self.primary_header[0] = (self.primary_header[0] << self.shift[index]) | (field & self.mask[index])
            elif(index < 6):
                self.primary_header[1] = (self.primary_header[1] << self.shift[index]) | (field & self.mask[index])
            else:
                self.primary_header[2] = (self.primary_header[2] << self.shift[index]) | (field & self.mask[index])

    def create_secondary_header(self, function_code, checksum):
        self.secondary_header[0] = (self.secondary_header[0]) | (function_code & 0xFF)
        self.secondary_header[0] = (self.secondary_header[0] << 8) | (checksum & 0xFF)

    def update_checksum_secondary_header(self, new_checksum):
        # mask header so that only highest 8 bits are showing
        # mask new_checksum value so that only the lower 8 bits are showing
        # Combine
        self.secondary_header[0] = (self.secondary_header & 0xFF00) | (new_checksum & 0xFF)

    def calculate_checksum(self, packets):
        self.checksum = 0xFF

        for index, packet in enumerate(packets):
            if index == 3:
                # lower 8 bits are the checksum
                # do not include in calculation
                self.checksum ^= (packet & 0xFF00)
            else:
                self.checksum ^= packet

        return self.checksum

    def get_headers_big_edian(self):
        return bytearray(self.primary_header.byteswap()) + bytearray(self.secondary_header.byteswap())


def createHeaders(packet_version,
                  packet_type,
                  secondary_header,
                  apid,
                  sequence_flag,
                  packet_count,
                  packet_data_length,
                  function_code,
                  checksum):

    headers = ccsds_headers(packet_version,
                            packet_type,
                            secondary_header,
                            apid,
                            sequence_flag,
                            packet_count,
                            packet_data_length,
                            function_code,
                            checksum)

    headersByteArray = headers.get_headers_big_edian()

    return headersByteArray

def createHeadersWithPacket(packet_version,
                             packet_type,
                             secondary_header,
                             apid,
                             sequence_flag,
                             packet_count,
                             packet_data_length,
                             function_code,
                             checksum,
                             packet):

    headers = ccsds_headers(packet_version,
                            packet_type,
                            secondary_header,
                            apid,
                            sequence_flag,
                            packet_count,
                            packet_data_length,
                            function_code,
                            checksum)

    headersByteArray = headers.get_headers_big_edian()
    headersByteArray += packet

    # Recalculate checksum
    new_check_sum = headers.calculate_checksum(headersByteArray)

    # get header again with new checksum
    headersByteArray = headers.get_headers_big_edian()

    # add package to new headers
    headersByteArray += packet

    return headersByteArray


def create_packet(parameters_value, parameters_name, parameters_type):
    packetClass = ccsds_pkt(parameters_value, parameters_name, parameters_type)
    packet = packetClass.create_pkt()

    return packet


if __name__ == "__main__":
    # packet_version
    # packet_type
    # secondary_header
    # apid
    # sequence_flag
    # packet_count
    # packet_data_length (total lenght - 7)
    # function_code
    # checksum

    packet = createHeaders(0, 1, 1, 130, 3, 0, 1, 0, 0)

    udp.sendUdp("192.168.200.15", 1234, packet)
    packet = createHeaders(0, 1, 1, 128, 3, 0, 18, 6, 0)
    ip = "192.168.200.28".encode('utf-8')
    newpacket = packet + ip.byteswap()
    udp.sendUdp("192.168.200.15", 1234, newpacket)
