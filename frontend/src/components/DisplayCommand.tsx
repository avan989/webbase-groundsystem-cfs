import styles from "../styles/displayCommand.module.css"
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import { useEffect, useState } from 'react';
import AppCommand from "./AppCommand";


const inputProp: any = {
    style: {fontSize: 12, color: "black"},
}

const CommandDisplay = () => {

    const [command, setCommand] = useState({});
    const [appName, setApp] = useState("")

    const requestOptions = {
        method: 'GET'
    }

    const handleChange = (event: any) => {
        setApp(event.target.value);
      };

    useEffect(() => {
        fetch('http://localhost:8000/api/command_api', requestOptions)
        .then(response => response.json().then(data => {
            let dataValue = JSON.parse(data.data);

            setCommand(dataValue)
        }))
    }, []);

    return (
        <div className={styles.CommandContainer}>
            <span className={styles.Title}>Commands</span>
            <FormControl>
                <TextField
                    margin = "dense"
                    className={styles.Selection}
                    select
                    variant = "outlined"
                    label = "Select Application"
                    value = {appName}
                    onChange = {handleChange}
                    InputLabelProps = {inputProp}
                >
                    {
                        Object.entries(command).map(([key, value]) => {
                            return (<MenuItem value={key}> {key} </MenuItem>)
                        })
                    }
                </TextField>
                <AppCommand commandDict = {command} application = {appName} />
            </FormControl>
        </div>
    )
}

export default CommandDisplay