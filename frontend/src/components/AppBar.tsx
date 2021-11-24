import styles from "../styles/appbar.module.css";
import {useSelector} from "react-redux";
import {initStateInter} from "../types/types"
import AppBarMaterialUI from "@material-ui/core/AppBar";

const AppBar = () => {

    const ipHost: string = useSelector((state: initStateInter) => {
        return state.ipHost
    })

    const ipTarget: string = useSelector((state: initStateInter) => {
        return state.ipTarget
    })

    const portTarget: number = useSelector((state: initStateInter) => {
        return state.portTarget
    })

    const portHost: number = useSelector((state: initStateInter) => {
        return state.portHost
    })

    return (
        <div >
            <AppBarMaterialUI position="static" className={styles.AppBarContainer}>
                <div className = {styles.Row}>
                    <span className={styles.Item}> Target IP Address <br/> {ipTarget} </span> 
                    <span className={styles.Item}> Target Port <br/> {portTarget} </span>
                    <span className={styles.Item}> Host IP Address <br/> {ipHost} </span>
                    <span className={styles.Item}> Host Port <br/> {portHost} </span>
                </div>
            </AppBarMaterialUI>
        </div>
    )
}

export default AppBar