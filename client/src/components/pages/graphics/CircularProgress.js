import { CircularProgress, Box } from '@mui/material';

export default function ProgressCircle () {
    return (
        <Box sx={{
            width          : '100%',
            height         : '80px',
            display        : 'flex',
            justifyContent : 'center',
            alignItems     : 'center'
        }}
        >
            <CircularProgress/>
        </Box>
    );
}
