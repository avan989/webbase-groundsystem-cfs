import styles from "../styles/customCommand.module.css"
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import {useDispatch, useSelector} from "react-redux";
import {useState} from "react"
import {CCSDS_CFS_Header, initStateInter} from '../types/types';

const ccsdsHeaderField: CCSDS_CFS_Header = {
    name: ["Primary Version Number", 
           "Packet Type",
           "Secondary Header", 
           "APID",
           "Sequence Flag",
           "Packet Sequence",
           "Packet Length",
           "Function Code",
           "Check Sum"
        ]
}

const inputProp: any = {
    style: {fontSize: 12, color: "black"},
}

const CustomCommand = () => {

    const [state, setInputFieldState] = useState([0])
    const dispatch = useDispatch();
    let IpTarget: string = useSelector((state: initStateInter) => {
        return state.ipTarget
    })
    let portTarget: Number = useSelector((state: initStateInter) => {
        return state.portTarget
    })

    function changeTextFieldHandler(key: number, event: any) {

        setInputFieldState((previousState: number[]) => {
            previousState[key] = parseInt(event.target.value)
            return previousState
        }) 
    }
    
    function sendCusomCommand(){
        let body: {data: {[key: string]: number}, address: string, port: Number} = {
            data: {},
            address: "",
            port: -1
        }

        ccsdsHeaderField.name.map((val, key) => {
            return (body.data[val] = state[key]);
        })

        body.address = IpTarget;
        body.port = portTarget;

        console.log(body)

        const requestOptions = {
            method: 'POST',
            body: JSON.stringify(body)
        }

        fetch('http://localhost:8000/api/custom_command_no_param', requestOptions)
            .then(response => response.json().then(data => {
                let message = "";
                let dataValue = JSON.parse(data.data);
                ccsdsHeaderField.name.map((val, key) => {
                    return (message += val + ": " + dataValue[val] + " ");
                })

                dispatch({
                    type: "Add Message",
                    message: ["API Request Status: " + data.success, message]
                })
            }))
    }

    return (
        <div className={styles.CustomCommandContainer}>
            <span className={styles.Title}>Custom Command (No Parameter)</span>
            <form className={styles.Form}>
                {            
                    ccsdsHeaderField.name.map((val, key) => 
                    {
                        return (
                            <span>
                                <TextField className={styles.Field}
                                    margin = "dense"
                                    label = {val}
                                    type = "number"
                                    variant = "outlined"
                                    InputLabelProps = {inputProp}
                                    required
                                    fullWidth
                                    onChange = {(event) => { changeTextFieldHandler(key, event)}}
                                />
                            </span>
                        )
                    })
                }
                <span className={styles.SendCustomCommandButton}>
                    <Button onClick={sendCusomCommand} variant="contained" color="primary"> Send </Button>
                </span>
            </form>
        </div>
    )
}


export default CustomCommand