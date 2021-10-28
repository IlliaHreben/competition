
import { useState }         from 'react';
import Box                  from '@mui/material/Box';
import TextField            from '@mui/material/TextField';
import Container            from '@mui/material/Container';
import AdapterDateFns       from '@mui/lab/AdapterLuxon';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker           from '@mui/lab/DatePicker';
import Button               from '@mui/material/Button';

import api                  from '../../../api-singleton';

import styles               from './create.module.css';

// eslint-disable-next-line react/prop-types
export default function CompetitionCreate ({ history, location }) {
    const [ name, setCompetitionName ] = useState('');
    const [ description, setCompetitionDesc ] = useState('');
    const [ ringsCount, setRingsCount ] = useState('');
    const [ tatamisCount, setTatamisCount ] = useState('');
    const [ startDate, setStartDate ] = useState(null);
    const [ endDate, setEndDate ] = useState(null);

    const disableCreateButton = name < 2 ||
        description < 2 ||
        ringsCount === '' ||
        tatamisCount === '' ||
        !startDate ||
        !endDate;

    const handleChange = type => e => {
        const typeToSetStateFn = {
            name         : setCompetitionName,
            description  : setCompetitionDesc,
            ringsCount   : setRingsCount,
            tatamisCount : setTatamisCount
        };
        typeToSetStateFn[type](e.target.value);
    };

    const handleDateChange = type => value => {
        const typeToSetStateFn = {
            startDate : setStartDate,
            endDate   : setEndDate
        };
        typeToSetStateFn[type](value);
    };

    const onCreate = async () => {
        const { data } = await api.competitions.create({
            name,
            description,
            startDate,
            endDate,
            ringsCount,
            tatamisCount
        });
        // eslint-disable-next-line react/prop-types
        history.push(`${location.pathname}/${data.id}/edit`);
    };

    return (
        <div className={styles.page}>
            <Box className={styles.form}
                component="form"
                sx={{
                    display           : 'flex',
                    flexDirection     : 'column',
                    '& > :not(style)' : { m: 1 }
                }}
                // noValidate
                // autoComplete="off"
            >
                <TextField
                    required
                    fullWidth
                    id="competition-name-input"
                    label="Competition name"
                    value={name}
                    onChange={handleChange('name')}
                />
                <TextField
                    required
                    fullWidth
                    id="competition-desc-input"
                    label="Competition description"
                    value={description}
                    onChange={handleChange('description')}
                    minRows={4}
                    multiline
                />

                <Container maxWidth="sm" className= {styles.formRow}>
                    <TextField className={styles.countingRings}
                        // fullWidth
                        required
                        type="number"
                        id="competition-rings-input"
                        label="Rings count"
                        value={ringsCount}
                        onChange={handleChange('ringsCount')}
                    />
                    <TextField className={styles.countingTatamis}
                        // fullWidth
                        spacing={1}
                        required
                        type="number"
                        id="competition-rings-input"
                        label="Tatamis count"
                        value={tatamisCount}
                        onChange={handleChange('tatamisCount')}
                    />
                </Container>

                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Container maxWidth="sm" className= {styles.formRow}>
                        <DatePicker className={styles.startDateInput}
                            label="Start date (without weighing day)"
                            value={startDate}
                            onChange={handleDateChange('startDate')}
                            renderInput={(params) => <TextField {...params} />}
                        />
                        <DatePicker className={styles.endDateInput}
                            label="End date"
                            value={endDate}
                            onChange={handleDateChange('endDate')}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </Container>
                </LocalizationProvider>
                <Button
                    disabled={disableCreateButton}
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={() => onCreate()}
                >Create
                </Button>

            </Box>
        </div>
    );
}
