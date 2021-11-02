import PropTypes            from 'prop-types';
import TextField            from '@mui/material/TextField';
import Container            from '@mui/material/Container';
import AdapterDateFns       from '@mui/lab/AdapterLuxon';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker           from '@mui/lab/DatePicker';
import Box                  from '@mui/material/Box';
import Button               from '@mui/material/Button';

import styles               from './update.module.css';

GeneralSettingsTab.propTypes = {
    handleDateChange    : PropTypes.func.isRequired,
    handleChange        : PropTypes.func.isRequired,
    onSave              : PropTypes.func.isRequired,
    disableUpdateButton : PropTypes.bool.isRequired,
    data                : PropTypes.shape({
        name        : PropTypes.string.isRequired,
        description : PropTypes.string.isRequired,
        startDate   : PropTypes.string.isRequired,
        endDate     : PropTypes.string.isRequired
    }).isRequired

};

export default function GeneralSettingsTab (props) {
    const { handleDateChange, handleChange, disableUpdateButton, onSave, data } = props;

    return (
        <Box className={styles.form}
            component="form"
            sx={{
                display           : 'flex',
                flexDirection     : 'column',
                '& > :not(style)' : { m: 1 }
            }}
        >
            <TextField
                required
                fullWidth
                id="competition-name-input"
                label="Competition name"
                value={data.name}
                onChange={handleChange('name')}
            />
            <TextField
                required
                fullWidth
                id="competition-desc-input"
                label="Competition description"
                value={data.description}
                onChange={handleChange('description')}
                minRows={4}
                multiline
            />

            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Container maxWidth="sm" className= {styles.formRow}>
                    <DatePicker className={styles.startDateInput}
                        label="Start date (without weighing day)"
                        value={data.startDate}
                        onChange={handleDateChange('startDate')}
                        renderInput={(params) => <TextField {...params} />}
                    />
                    <Box sx={{ padding: '0.75vh' }} />
                    <DatePicker className={styles.endDateInput}
                        label="End date"
                        value={data.endDate}
                        onChange={handleDateChange('endDate')}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </Container>
            </LocalizationProvider>
            <Button
                disabled={disableUpdateButton}
                fullWidth
                variant="contained"
                size="large"
                onClick={() => onSave()}
            >Save
            </Button>

        </Box>
    );
}
