import { createStore } from "redux";
import {socket} from "../context/socket"
import {initStateInter} from "../types/types"

const initState: initStateInter = {
    websocket: socket,
    messages: ["Initializing Events Window", 
               "<!> Remember To Enable Telementry And Update Setting <!>",
               "<!> Host IP Address: none, Target IP Address: none, Target Port: -1 "],
    ipHost: "127.0.0.1",
    ipTarget: "192.168.200.15",//"172.17.0.1",
    portTarget: 1234,
    portHost: 1235
}

let rootReducer = (state: initStateInter = initState, action: any) => {

    switch(action.type){
        case "Add Message":
            return {
                ...state,
                messages: state.messages.concat(action.message)
            }
        case "Update Setting":
            return {
                ...state,
                ipHost: action.ipHost,
                ipTarget: action.ipTarget,
                portTarget: action.portTarget,
                portHost: action.portHost
            }
        default:
            return state
    }
}

export default createStore(rootReducer);