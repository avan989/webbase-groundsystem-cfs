import Grid from '@material-ui/core/Grid';
import CustomCommand from "./CustomCommand";
import DisplayCommand from "./DisplayCommand"
import styles from "../styles/commandWindow.module.css";

const CommandWindow = () => {

    return (
        <Grid spacing={1} className={styles.Container}>
            <Grid item md={12}>
                <CustomCommand />
            </Grid>
            <Grid item md={12} className={styles.DisplayContainer}>
                <DisplayCommand />
            </Grid>
        </Grid>

    )
}

export default CommandWindow