import styles from "../styles/display.module.css";
import { useSelector} from "react-redux";
import {initStateInter} from "../types/types"

const DisplayWindow = () => {

    const messages: string[] = useSelector((state: initStateInter) => {
        return state.messages
    })

    return (
        <div className={styles.DisplayContainer}>
            <ul className={styles.ListItems}>
                {
                    messages.map((val, key) => {
                        const newString = key + " >>> " + val
                        return <li className={styles.ListItemRow}> {newString} </li>
                    })
                }
            </ul>
        </div>
    )
}

export default DisplayWindow