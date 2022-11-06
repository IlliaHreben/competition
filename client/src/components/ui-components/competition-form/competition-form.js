import PropTypes from 'prop-types';
import { useState } from 'react';

import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { AdapterLuxon as AdapterDateFns } from '@mui/x-date-pickers/AdapterLuxon';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';

import styles from './competition-form.module.css';

CompetitionForm.propTypes = {
    // handleDateChange : PropTypes.func.isRequired,
    handleConfirm   : PropTypes.func.isRequired,
    // onSave           : PropTypes.func.isRequired,
    withFightSpaces : PropTypes.bool,
    competition     : PropTypes.shape({
        id          : PropTypes.string.isRequired,
        name        : PropTypes.string.isRequired,
        description : PropTypes.string.isRequired,
        startDate   : PropTypes.string.isRequired,
        endDate     : PropTypes.string.isRequired
    })
};

export default function CompetitionForm ({ competition, handleConfirm, withFightSpaces }) {
    const [ competitionName, setCompetitionName ] = useState(competition?.name || '');
    const [ description, setCompetitionDesc ] = useState(competition?.description || '');
    const [ startDate, setStartDate ] = useState(competition?.startDate || '');
    const [ endDate, setEndDate ] = useState(competition?.endDate || '');
    const [ errors, setErrors ] = useState({});
    const [ ringsCount, setRingsCount ] = useState('');
    const [ tatamisCount, setTatamisCount ] = useState('');

    const handleChangeFields = field => (e) => {
        if (errors[field]) {
            const oldErrors = { ...errors };
            delete oldErrors[field];
            setErrors(oldErrors);
        }
        fieldToError[field]?.(e);
        handleChange(field)(e);
    };

    const handleChange = type => e => {
        const typeToSetStateFn = {
            name         : setCompetitionName,
            description  : setCompetitionDesc,
            startDate    : setStartDate,
            endDate      : setEndDate,
            ringsCount   : setRingsCount,
            tatamisCount : setTatamisCount
        };
        typeToSetStateFn[type](e?.target?.value ?? e);
    };

    const fieldToError = {
        name        : e => e.target.value.length < 3 && setErrors({ ...errors, name: 'Name is too short.' }),
        description : e => e.target.value.length < 3 && setErrors({ ...errors, description: 'Description is too short.' }),
        startDate   : value => {
            if (!endDate || new Date(value) <= new Date(endDate)) return;
            setErrors({ ...errors, startDate: 'Must be earlier than end date.' });
        },
        endDate: value => {
            if (!startDate || new Date(value) >= new Date(startDate)) return;
            setErrors({ ...errors, endDate: 'Must be later than start date.' });
        }
    };

    return (
        <Box>
            <TextField
                required fullWidth
                id="competition-name-input"
                label="Competition name"
                value={competitionName}
                onChange={handleChangeFields('name')}
                error={!!errors.name}
                helperText={errors.name || ' '}
                sx={{ marginTop: '10px', marginBottom: '10px' }}
            />
            <TextField
                required fullWidth
                id="competition-desc-input"
                label="Competition description"
                value={description}
                onChange={handleChangeFields('description')}
                minRows={4} multiline
                error={!!errors.description}
                helperText={errors.description || ' '}
            />

            {withFightSpaces &&
                <Container maxWidth="sm" className= {styles.formRow}>
                    <TextField className={styles.countingRings}
                        required
                        type="number"
                        id="competition-rings-input"
                        label="Rings count"
                        value={ringsCount}
                        onChange={handleChange('ringsCount')}
                    />
                    <TextField className={styles.countingTatamis}
                        spacing={1}
                        required
                        type="number"
                        id="competition-rings-input"
                        label="Tatamis count"
                        value={tatamisCount}
                        onChange={handleChange('tatamisCount')}
                    />
                </Container>
            }

            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Container
                    maxWidth="sm" className={styles.formRow}
                    sx={{ marginTop: '10px' }}
                >
                    <DatePicker className={styles.startDateInput}
                        label="Start date (without weighing day)"
                        value={startDate}
                        mask="__.__.____"
                        onChange={handleChangeFields('startDate')}
                        renderInput={(params) =>
                            <TextField
                                {...params}
                                error={!!errors.startDate}
                                helperText={errors.startDate || ' '}
                            />}
                    />
                    <Box sx={{ padding: '0.75vh' }} />
                    <DatePicker className={styles.endDateInput}
                        label="End date"
                        value={endDate}
                        mask="__.__.____"
                        onChange={handleChangeFields('endDate')}
                        renderInput={(params) =>
                            <TextField
                                {...params}
                                error={!!errors.endDate}
                                helperText={errors.endDate || ' '}
                            />}
                    />
                </Container>
            </LocalizationProvider>
            <Button
                disabled={!!Object.keys(errors).length}
                fullWidth
                variant="contained"
                size="large"
                onClick={() => handleConfirm({
                    name: competitionName,
                    description,
                    startDate,
                    endDate,
                    ringsCount,
                    tatamisCount
                })}
                sx={{ marginTop: '5px', marginBottom: '5px' }}
            >Save
            </Button>
        </Box>
    );
}
