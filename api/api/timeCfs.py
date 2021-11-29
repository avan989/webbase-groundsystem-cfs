import os
current_path = os.path.dirname(__file__)

def convertTimeRelativeToConfig(cfsSecond):
    json_file = open(current_path + "/cfs_config.json", "r")
    commands_content_json_file = json_file.read()


    