import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export function SchedulesHeader() {

    return (
        <Box display="flex" alignItems="center" mb={5}>
            <Typography variant="h4" flexGrow={1}>
            Schedules
            </Typography>
        </Box>
    );
}