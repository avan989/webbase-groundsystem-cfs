import DisplayWindow  from './DisplayWindow';
import CommandWindow from './CommandWindow';
import Grid from '@material-ui/core/Grid';

const EventsDisplay = () => {
    return (
        <div>
            <Grid container spacing={0}>
                <Grid item md={9}>
                    <DisplayWindow />
                </Grid>
                <Grid item md={3}>
                    <CommandWindow />
                </Grid>
            </Grid>
        </div>
    )
}

export default EventsDisplay

