import styles from "../styles/appCommand.module.css";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import {AppDataSend} from '../types/types';
import {useSelector} from "react-redux";
import {initStateInter} from "../types/types";
import {useState, useEffect} from "react"

const inputProp: any = {
    style: {fontSize: 12, color: "black"},
}

const data: AppDataSend = {
    appName: "",
    address: "",
    port: -1,
    commandName: "",
    isParameter: false,
    parameter: {}
}

const httpAddress: string = ""


const AppCommand = (prop: any ) => {

    const commandParameter = prop.commandDict[prop.application];
    const ipTarget: string = useSelector((state: initStateInter) => {
        return state.ipTarget
    })
    const portTarget: number = useSelector((state: initStateInter) => {
        return state.portTarget
    })

    const [address, updateAddress] = useState(httpAddress)
    const [state, updateState] = useState(data)


    let command = {}
    
    try {
        command = commandParameter.commands;
    }
    catch(e){
        command = {};
    }

    const getNumPara = (value: any): number => {
        return value.num_parameter;
    }

    const getParatype = (value: any): string[] => {
        return value.parameter_type;
    }

    const getParaName = (value: any): string[] => {
        return value.parameter_name;
    }

    const openForm = (parameter: {key: string}) => (Event: any) => {

        const element = document.getElementById(parameter.key)
        if(element != undefined)
        {
            if(element.style.display === "none"){
                element.style.display = "block";
            }
            else {
                element.style.display = "none";
            }

            element.style.position = "absolute";
            element.style.opacity = "1";
            element.style.height = "200px";
        }
    }

    const handleSubmit = (commandName: any, numParameter: any, nameParameter: any) => (event: any) => {
        event.preventDefault();
        let data: {[key: string]: any} = {};
        let address: string = "http://localhost:8000/api/command_with_parm";
        let element: any;
        let id: string;

        for (let i = 0; i < numParameter; i++){
            id = commandName + "_" + nameParameter[i];
            element = document.getElementById(id);
            data[nameParameter[i]] = element.value;
        }

        updateAddress(address);

        updateState(() => {
            return {
                appName: prop.application,
                address: ipTarget,
                port: portTarget,
                commandName: commandName,
                isParameter: true,
                parameter: data
            }
        });
    }

    const noParameterButton = (key: string) => (Event: any) => {
        let address = "http://localhost:8000/api/no_parm_command";
        updateAddress(address);
        updateState({
                appName: prop.application,
                address: ipTarget,
                port: portTarget,
                commandName: key,
                isParameter: false,
                parameter: {}
        });
    };

    const postMessage = (address: string) => {
        const requestOptions = {
            method: "POST",
            body: JSON.stringify(state)
        };

        fetch(address, requestOptions);
    }

    useEffect(() => {
        postMessage(address);
    }, [state]);

    return (
        <div className={styles.AppCommandContainer}>
            {
                Object.entries(command).map(([key, value]) => {
                   const parameter_number = getNumPara(value)
                   const parameter_type = getParatype(value)
                   const parameter_name = getParaName(value)
                   
                   if (parameter_number === 0){
                        return (<div className={styles.NoParameterContainer}>
                                    <Button variant="contained" 
                                            color="primary" 
                                            onClick={noParameterButton(key)}
                                    > 
                                        {key} 
                                    </Button> 
                                </div>)
                   } else if (parameter_number >= 1)
                   {
                       return (
                           <div className={styles.ParameterContainer}>
                               <Button variant="contained" color="primary" onClick={openForm({key})}>{key}</Button>
                                <form id={key} 
                                      onSubmit={handleSubmit(key, parameter_number, parameter_name)} 
                                      className={styles.FormContainer}
                                >
                                    {
                                        parameter_name.map((value, index)=>{
                                            let type;

                                            if (parameter_type[index]  === "string"){
                                                type = "string";
                                            } else if (parameter_type[index]  === "utf-8") 
                                                type = "string";
                                            else {
                                                type = "number";
                                            }
                                            return (                                
                                                <TextField className={styles.Field}
                                                id={key + "_" + parameter_name[index]}
                                                margin = "dense"
                                                label = {value}
                                                type = {type}
                                                variant = "outlined"
                                                InputLabelProps = {inputProp}
                                                required
                                                fullWidth
                                            />)
                                        })
                                    }

                                    <Button className={styles.FormSendButton} 
                                            variant="contained" 
                                            color="primary"
                                            type="submit" > Send </Button>
                                </form>
                            </div>
                       )
                   }
                    return (<div> {key} </div>)
                })  
            }

        </div>
    )
}

export default AppCommand