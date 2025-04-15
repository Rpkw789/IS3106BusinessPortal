import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { _roles, _roleType, _users } from 'src/_mock';

export function SchedulesHeader() {

    return (
        <Box display="flex" alignItems="center" mb={5} ml={3}>
            <Typography variant="h4" flexGrow={1}>
            Schedules
            </Typography>
        </Box>
    );
}