
import { Fragment, useEffect, useState } from 'react';
import SwipeableViews                    from 'react-swipeable-views';
import PropTypes                         from 'prop-types';
import Box                               from '@mui/material/Box';
import Tabs                              from '@mui/material/Tabs';
import Tab                               from '@mui/material/Tab';
// import AppBar                  from '@mui/material/AppBar';
import Typography                        from '@mui/material/Typography';
import TextField                         from '@mui/material/TextField';
import Container                         from '@mui/material/Container';
import AdapterDateFns                    from '@mui/lab/AdapterLuxon';
import LocalizationProvider              from '@mui/lab/LocalizationProvider';
import DatePicker                        from '@mui/lab/DatePicker';
import Button                            from '@mui/material/Button';
import List                              from '@mui/material/List';
import ListItem                          from '@mui/material/ListItem';
import ListItemButton                    from '@mui/material/ListItemButton';
import ListItemIcon                      from '@mui/material/ListItemIcon';
import ListItemText                      from '@mui/material/ListItemText';
import Avatar                            from '@mui/material/Avatar';
import IconButton                        from '@mui/material/IconButton';
import Divider                           from '@mui/material/Divider';
import Paper                             from '@mui/material/Paper';

import DeleteIcon                        from '@mui/icons-material/Delete';
import AddIcon                           from '@mui/icons-material/Add';

import RingIcon                          from '../../../assets/icons/ring.png';
import TatamiIcon                        from '../../../assets/icons/tatami.png';

import api                               from '../../../api-singleton';

import styles                            from './edit.module.css';
import { useParams }                     from 'react-router';

function TabPanel (props) {
    const { children, value, index } = props;

    return (
        <Box
            sx={{ display: 'flex', justifyContent: 'center', p: 3 }}
            role="tabpanel"
            hidden={value !== index}
        >
            {value === index && children}
        </Box>
    );
}

TabPanel.propTypes = {
    children : PropTypes.node,
    index    : PropTypes.number.isRequired,
    value    : PropTypes.number.isRequired
};

// eslint-disable-next-line react/prop-types
export default function CompetitionCreate () {
    const [ tab, setTab ] = useState(0);
    const [ loading, setLoading ] = useState(false);
    const [ competition, setCompetition ] = useState({});
    const [ name, setCompetitionName ] = useState('');
    const [ description, setCompetitionDesc ] = useState('');
    const [ startDate, setStartDate ] = useState(null);
    const [ endDate, setEndDate ] = useState(null);
    const [ fightSpaces, setFightSpaces ] = useState([]);

    const disableUpdateButton = name < 2 ||
        description < 2 ||
        !startDate ||
        !endDate;

    const { id: competitionId } = useParams();

    useEffect(() => {
        const requestData = async (params) => {
            const { data } = await api.competitions.show(competitionId, params);
            setCompetition(data);
            setCompetitionName(data.name);
            setCompetitionDesc(data.description);
            setStartDate(data.startDate);
            setEndDate(data.endDate);
            setFightSpaces(data.linked.fightSpace);
            setLoading(true);
        };

        requestData();
    }, [ competitionId ]);

    const changeSpaceState = (id) => {
        const spaceIndex = fightSpaces.findIndex(fs => fs.id === id);
        const data = [ ...fightSpaces ];
        const [ currentSpace ] = data.splice(spaceIndex, 1);
        setFightSpaces([
            ...data,
            { ...currentSpace, disabled: !(currentSpace.disabled === true) }
        ]);
    };

    const handleChangeTab = (event, newValue) => {
        setTab(newValue);
    };

    const handleChangeTab2 = (index) => {
        setTab(index);
    };

    const handleChange = type => e => {
        const typeToSetStateFn = {
            name        : setCompetitionName,
            description : setCompetitionDesc
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

    return (
        <div className={styles.page}>
            <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
                <Tabs value={tab} onChange={handleChangeTab} centered>
                    <Tab label="General" />
                    <Tab label="Fight spaces" />
                    <Tab label="Categories" />
                </Tabs>

                {loading &&
                    <SwipeableViews
                    // axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                        index={tab}
                        onChangeIndex={handleChangeTab2}
                    >
                        <TabPanel value={tab} index={0}>
                            <GeneralSettingsTab
                                handleDateChange={handleDateChange}
                                handleChange={handleChange}
                                disableUpdateButton={disableUpdateButton}
                                data={{
                                    name,
                                    description,
                                    startDate,
                                    endDate
                                }}
                            />
                        </TabPanel>
                        <TabPanel value={tab} index={1}>
                            <FightSpacesTab
                                fightSpaces={fightSpaces}
                                days={competition.days}
                                changeSpaceState={changeSpaceState}
                            />
                        </TabPanel>
                        <TabPanel value={tab} index={2}>
                            Item Three
                        </TabPanel>
                    </SwipeableViews>
                }
            </Box>
        </div>
    );
}

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

function GeneralSettingsTab (props) {
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

FightSpacesTab.propTypes = {
    fightSpaces: PropTypes.arrayOf(PropTypes.shape({
        id             : PropTypes.string,
        type           : PropTypes.string,
        orderNumber    : PropTypes.number,
        competitionDay : PropTypes.number
    }).isRequired),
    days             : PropTypes.number.isRequired,
    changeSpaceState : PropTypes.func.isRequired

};

function FightSpacesTab ({ changeSpaceState, ...props }) {
    const fightSpaces = Array.from({ length: props.days }).map((_, i) => {
        return props.fightSpaces
            .filter(fs => fs.competitionDay === i + 1)
            .sort((a, b) => b.orderNumber - a.orderNumber)
            .sort((a, b) => a.type < b.type ? 1 : -1);
    });

    const types = {
        ring   : 'Ring',
        tatami : 'Tatami'
    };

    return (
        <Paper sx={{ maxWidth: '500px', width: '100%' }}>
            <List
                sx={{
                    width   : '100%',
                    bgcolor : 'background.paper'
                }}
            >
                {fightSpaces.map((fs, i) => (
                    <Fragment key={i}>
                        {i > 0 && <Divider sx={{ marginTop: '2vh' }} />}
                        <ListItem divider>
                            <ListItemText primary={`Competition day ${i + 1}`}/>
                        </ListItem>
                        {fs.map((f, k) => (
                            <ListItem
                                key={f.id}
                                disabled={f.disabled}
                                secondaryAction={
                                    <IconButton
                                        // disabled={fs[k + 1]?.type === f.type && !fs[k + 1]?.disabled}
                                        disabled={fs[k - 1]?.type === f.type && fs[k - 1]?.disabled && f.disabled}
                                        edge="end"
                                        aria-label="delete"
                                        onClick={() => changeSpaceState(f.id)}
                                    >
                                        {f.disabled
                                            ? <AddIcon/>
                                            : <DeleteIcon />
                                        }
                                    </IconButton>
                                }
                            >
                                <ListItemIcon>
                                    <Avatar src={f.type === 'ring' ? RingIcon : TatamiIcon} variant="rounded" />
                                </ListItemIcon>
                                <ListItemText primary={`${types[f.type]} ${f.orderNumber}`} />
                            </ListItem>
                        ))}
                    </Fragment>
                ))}
            </List>
        </Paper>
    );
}
