
import { Fragment, useEffect, useState } from 'react';
import SwipeableViews                    from 'react-swipeable-views';
import PropTypes                         from 'prop-types';
import { connect }                       from 'react-redux';
import { useParams }                     from 'react-router';

import Box                               from '@mui/material/Box';
import Tabs                              from '@mui/material/Tabs';
import Tab                               from '@mui/material/Tab';
import TextField                         from '@mui/material/TextField';
import Container                         from '@mui/material/Container';
import AdapterDateFns                    from '@mui/lab/AdapterLuxon';
import LocalizationProvider              from '@mui/lab/LocalizationProvider';
import DatePicker                        from '@mui/lab/DatePicker';
import Button                            from '@mui/material/Button';
import List                              from '@mui/material/List';
import ListItem                          from '@mui/material/ListItem';
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
import { show as showCompetition }       from '../../../actions/competitions';
import styles                            from './edit.module.css';

const uuid = crypto.randomUUID.bind(crypto);

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

CompetitionCreate.propTypes = {
    history          : PropTypes.object.isRequired,
    location         : PropTypes.object.isRequired,
    competition      : PropTypes.object,
    fetchCompetition : PropTypes.func.isRequired
};

function CompetitionCreate ({ history, location, competition, fetchCompetition }) {
    const [ tab, setTab ] = useState(0);
    const [ loading, setLoading ] = useState(false);
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
        if (!competition) {
            fetchCompetition(competitionId);
        }
    }, [ competitionId, fetchCompetition, competition ]);

    useEffect(() => {
        if (competition) {
            setCompetitionName(competition.name);
            setCompetitionDesc(competition.description);
            setStartDate(competition.startDate);
            setEndDate(competition.endDate);
            setFightSpaces(competition.linked.fightSpace);
            setLoading(true);
        }
    }, [ competition ]);

    useEffect(() => document.title = `Settings - ${name}`, [ name ]);

    useEffect(() => {
        const queryTab = +(new URLSearchParams(location.search).get('tab'));
        setTab(queryTab || 0);
    }, [ location.search ]);

    const changeTab = (i1, i2) => history.replace(`${location.pathname}?tab=${i2 !== undefined ? i2 : i1}`);

    const onDeleteSpace = ({ id, customId }) => {
        const paranoid = !!id;
        const spaceIndex = fightSpaces.findIndex(fs => fs.id === id || (customId && fs.customId === customId));
        const data = [ ...fightSpaces ];
        const [ currentSpace ] = data.splice(spaceIndex, 1);
        setFightSpaces([
            ...data,
            ...paranoid ? [ { ...currentSpace, disabled: !(currentSpace.disabled === true) } ] : []
        ]);
    };

    const createSpace = (type, day) => {
        const orderNumber = Math.max(...fightSpaces
            .filter(s => s.type === type && s.competitionDay === day)
            .map(s => s.orderNumber)) + 1;
        setFightSpaces([
            ...fightSpaces,
            {
                customId       : uuid(),
                competitionDay : day,
                type,
                orderNumber
            }
        ]);
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
                <Tabs value={tab} onChange={changeTab} centered>
                    <Tab label="General" />
                    <Tab label="Fight spaces" />
                    <Tab label="Categories" />
                </Tabs>

                {loading &&
                    <SwipeableViews
                        // axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                        index={tab}
                        onChangeIndex={changeTab}
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
                                onDeleteSpace={onDeleteSpace}
                                createSpace={createSpace}
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
        customId       : PropTypes.string,
        type           : PropTypes.string,
        orderNumber    : PropTypes.number,
        competitionDay : PropTypes.number
    }).isRequired),
    days          : PropTypes.number.isRequired,
    onDeleteSpace : PropTypes.func.isRequired,
    createSpace   : PropTypes.func.isRequired
};

function FightSpacesTab ({ onDeleteSpace, createSpace, ...props }) {
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
                        <ListItem
                            divider
                            secondaryAction={
                                <>
                                    {[ 'ring', 'tatami' ].map(type => (
                                        <Button
                                            key={type}
                                            onClick={() => createSpace(type, i + 1)}
                                            disabled={fs.some(f => f.type === type && f.disabled)}
                                        >
                                            {`Create ${type}`}
                                        </Button>
                                    ))}

                                </>
                            }
                        >
                            <ListItemText primary={`Competition day ${i + 1}`}/>
                        </ListItem>
                        {fs.map((f, k) => (
                            <ListItem
                                key={f.id || f.customId}
                                disabled={f.disabled}
                                secondaryAction={
                                    <IconButton
                                        // disabled={fs[k + 1]?.type === f.type && !fs[k + 1]?.disabled}
                                        disabled={f.disabled
                                            ? fs[k - 1]?.type === f.type && fs[k - 1]?.disabled
                                            : fs[k + 1]?.type === f.type && !fs[k + 1]?.disabled
                                        }
                                        edge="end"
                                        aria-label="delete"
                                        onClick={() => onDeleteSpace({ id: f.id, customId: f.customId })}
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
            <Button
                // disabled={disableUpdateButton}
                fullWidth
                variant="contained"
                size="large"
                // onClick={onSave}
            >Save
            </Button>
        </Paper>
    );
}

function mapStateToProps (state) {
    return {
        competition : state.competitions.active,
        isLoading   : state.competitions.isLoading
    };
}

function mapDispatchToProps (dispatch) {
    return {
        fetchCompetition: (...args) => dispatch(showCompetition(...args))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(CompetitionCreate);
