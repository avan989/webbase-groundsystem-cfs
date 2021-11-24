export interface initStateInter {
    websocket: any,
    messages: string[],
    ipHost: string,
    ipTarget: string,
    portTarget: number,
    portHost: number
}

export interface SideItem {
    name: string,
    icon: any,
    link: string
}

interface CommandParameter {
    name: string,
    type: any
}

export interface CommandType {
    name: string,
}

export interface CCSDS_CFS_Header {
    name: string[]
}

interface CommandSend {
    parameter: string
}

export interface AppDataSend {
    appName: string;
    address: string,
    port: number,
    commandName: string,
    isParameter: boolean,
    parameter: {[commandName: string]: CommandSend }
}

