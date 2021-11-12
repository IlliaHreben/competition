import PropTypes                       from 'prop-types';
import TextField                       from '@mui/material/TextField';
import Container                       from '@mui/material/Container';
import AdapterDateFns                  from '@mui/lab/AdapterLuxon';
import LocalizationProvider            from '@mui/lab/LocalizationProvider';
import DatePicker                      from '@mui/lab/DatePicker';
import Box                             from '@mui/material/Box';
import Paper                           from '@mui/material/Paper';
import Button                          from '@mui/material/Button';

import styles                          from './update.module.css';
import { useEffect, useState }         from 'react';
import { useDispatch }                 from 'react-redux';

import {
    // show as showCompetition,
    update as updateCompetition
} from '../../../../actions/competitions';
import { showSuccess }                 from '../../../../actions/errors';

GeneralSettingsTab.propTypes = {
    // handleDateChange : PropTypes.func.isRequired,
    // handleChange     : PropTypes.func.isRequired,
    // onSave           : PropTypes.func.isRequired,
    // disableUpdateButton : PropTypes.bool.isRequired,
    competition: PropTypes.shape({
        id          : PropTypes.string.isRequired,
        name        : PropTypes.string.isRequired,
        description : PropTypes.string.isRequired,
        startDate   : PropTypes.string.isRequired,
        endDate     : PropTypes.string.isRequired
    }).isRequired

};

export default function GeneralSettingsTab (props) {
    const { competition } = props;
    const [ competitionName, setCompetitionName ] = useState(competition.name);
    const [ description, setCompetitionDesc ] = useState(competition.description);
    const [ startDate, setStartDate ] = useState(competition.startDate);
    const [ endDate, setEndDate ] = useState(competition.endDate);
    const [ errors, setErrors ] = useState({});

    const dispatch = useDispatch();

    const fieldToError = {
        name        : e => e.target.value.length < 3 && setErrors({ ...errors, name: 'Name is too short.' }),
        description : e => e.target.value.length < 3 && setErrors({ ...errors, description: 'Description is too short.' }),
        startDate   : value => {
            if (new Date(value) <= new Date(endDate)) return;
            setErrors({ ...errors, startDate: 'Must be earlier than end date.' });
        },
        endDate: value => {
            if (new Date(value) >= new Date(endDate)) return;
            setErrors({ ...errors, endDate: 'Must be later than start date.' });
        }
    };

    const handleCompetitionSave = () => {
        dispatch(updateCompetition(competition.id, {
            name: competitionName,
            description,
            startDate,
            endDate
        }, () => dispatch(showSuccess('Competition was successfully changed.'))));
    };

    const handleChange = type => e => {
        const typeToSetStateFn = {
            name        : setCompetitionName,
            description : setCompetitionDesc,
            startDate   : setStartDate,
            endDate     : setEndDate
        };
        typeToSetStateFn[type](e?.target?.value ?? e);
    };

    const handleChangeFields = field => (e) => {
        if (errors[field]) {
            const oldErrors = { ...errors };
            delete oldErrors[field];
            setErrors(oldErrors);
        }
        fieldToError[field]?.(e);
        handleChange(field)(e);
    };

    useEffect(() => {
        setCompetitionName(competition.name);
        setCompetitionDesc(competition.description);
        setStartDate(competition.startDate);
        setEndDate(competition.endDate);
    }, [ competition ]);

    return (
        <Paper className={styles.form}
            component="form"
            sx={{
                display           : 'flex',
                flexDirection     : 'column',
                '& > :not(style)' : { m: 1.5 }
            }}
        >
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

                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Container
                        maxWidth="sm" className={styles.formRow}
                        sx={{ marginTop: '10px' }}
                    >
                        <DatePicker className={styles.startDateInput}
                            label="Start date (without weighing day)"
                            value={startDate}
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
                    onClick={() => handleCompetitionSave()}
                    sx={{ marginTop: '5px', marginBottom: '5px' }}
                >Save
                </Button>
            </Box>
        </Paper>
    );
}
