import Grid from '@material-ui/core/Grid';
import CustomCommand from "./CustomCommand";
import DisplayCommand from "./DisplayCommand"

const CommandWindow = () => {

    return (
        <Grid container spacing={1}>
            <Grid item md={12}>
                <CustomCommand />
            </Grid>
            <Grid item md={12}>
                <DisplayCommand />
            </Grid>
        </Grid>
    )
}

export default CommandWindow