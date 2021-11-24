import styles from "../styles/sidebar.module.css"
import SatelliteIcon from '@material-ui/icons/Satellite';
import SettingsIcon from '@material-ui/icons/Settings';
import {Link} from 'react-router-dom';
import {SideItem} from '../types/types'


const SideBarData: SideItem[] = [
    {
        name: "Setting",
        icon: <SettingsIcon />,
        link: "/setting"
    },
    {
        name: "Events Display",
        icon: <SatelliteIcon />,
        link: "/"

    }
]

const SideBar = () => {
    return (
        <div className={styles.SideBarContainer}>
            <div className={styles.LogoContainer}>
                <span className={styles.LogoText}> Dashboard </span>
            </div>
            <ul className={styles.SideBarList}> 
                {SideBarData.map((val, key) => {
                    //Call back function for every key
                    return (
                        <Link to={val.link} className={styles.Link}>
                            <li className={styles.SideBarRow}>
                                    <span className={styles.Icon}>{val.icon}</span> 
                                    <span className={styles.ItemsText}>{val.name} </span>
                            </li>
                        </Link>
                        )  
                })}
            </ul>
        </div>
    )
}

export default SideBar
