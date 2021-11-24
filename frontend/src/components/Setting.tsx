import styles from "../styles/setting.module.css";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import {useDispatch} from "react-redux";
import {useState} from "react";

const ipField = {
    name: ["Host IP Address", "Target IP Address", "Target IP Port", "Host Ip Port"],
}

const inputProp: any = {
    style: {fontSize: 12, color: "black"},
}

const field = {
    host: "",
    target: "",
    target_port: "",
    host_port: "" 
}


const Setting = () => {

    const dispatch = useDispatch();

    const [state, updateState] = useState(field)

    function changeTextFieldHandler(key: string, event: any) {

        switch (key) {
            case ipField.name[0]:
                updateState(() => {
                    return {
                        ...state,
                        host: event.target.value
                    }
                })
                break;

            case ipField.name[1]:
                updateState(() => {
                    return {
                        ...state,
                        target: event.target.value
                    }
                })
                break;

            case ipField.name[2]:
                updateState(() => {
                    return {
                        ...state,
                        target_port: event.target.value
                    }
                })
                break;

                case ipField.name[3]:
                    updateState(() => {
                        return {
                            ...state,
                            host_port: event.target.value
                        }
                    })
                    break;

        
            default:
                break;
        }
    }

    function updateButton(){
        dispatch({
            type: "Update Setting",
            ipHost: state.host,
            ipTarget: state.target,
            portTarget: Number(state.target_port),
            portHost: Number(state.host_port)
        })

        const message = "Host IP Address: " +  state.host + ", Target IP Address: " + state.target +
        ", Target Port: " + state.target_port + ", Host Port: " + state.host_port;

        dispatch({
            type: "Add Message",
            message: message
        })
    }

    return (
        <div className={styles.SettingContainer}>
            <div className={styles.FormContainer}>
                <form className={styles.Form}>
                    {ipField.name.map((val, key) => {
                        return (
                            <span className={styles.FieldRow}>
                                    <span className={styles.FieldName}> {val + ":"} </span>
                                    <TextField
                                        className={styles.TextField}
                                        margin = "dense"
                                        type = "text"
                                        variant = "outlined"
                                        InputLabelProps = {inputProp}
                                        required
                                        fullWidth
                                        onChange = {(event) => { changeTextFieldHandler(val, event)}}
                                    />
                            </span>
                        )})
                    }
                    <span className={styles.UpdateButton}>
                        <Button onClick={updateButton} variant="contained" color="primary"> Update </Button>
                    </span>
                </form>
            </div>
        </div>
    )
}

export default Setting
