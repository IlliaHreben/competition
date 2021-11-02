
import { useEffect, useState }       from 'react';
import SwipeableViews                from 'react-swipeable-views';
import PropTypes                     from 'prop-types';
import { useParams }                 from 'react-router';
import { useDispatch, useSelector }  from 'react-redux';

import Box                           from '@mui/material/Box';
import Tabs                          from '@mui/material/Tabs';
import Tab                           from '@mui/material/Tab';

import { show as showCompetition }   from '../../../../actions/competitions';
import styles                        from './update.module.css';
import GeneralSettingsTab            from './generalTab';
import FightSpacesTab                from './fightSpacesTab';

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

CompetitionUpdate.propTypes = {
    history  : PropTypes.object.isRequired,
    location : PropTypes.object.isRequired
};

function CompetitionUpdate ({ history, location }) {
    const [ tab, setTab ] = useState(0);
    const [ name, setCompetitionName ] = useState('');
    const [ description, setCompetitionDesc ] = useState('');
    const [ startDate, setStartDate ] = useState(null);
    const [ endDate, setEndDate ] = useState(null);
    const [ fightSpaces, setFightSpaces ] = useState([]);

    const { competition } = useSelector(mapStateToProps);
    const dispatch = useDispatch();

    const disableUpdateButton = name < 2 ||
        description < 2 ||
        !startDate ||
        !endDate;

    const { id: competitionId } = useParams();

    useEffect(() => {
        dispatch(showCompetition(competitionId));
    }, [ competition, competitionId, dispatch ]);

    useEffect(() => {
        if (!competition) return;
        setCompetitionName(competition.name);
        setCompetitionDesc(competition.description);
        setStartDate(competition.startDate);
        setEndDate(competition.endDate);
        setFightSpaces(competition.linked.fightSpace);
    }, [ competition ]);

    useEffect(() => document.title = `Settings - ${name}`, [ name ]);

    useEffect(() => {
        const queryTab = +(new URLSearchParams(location.search).get('tab'));
        setTab(queryTab || 0);
    }, [ location.search ]);

    const changeTab = (i1, i2) => history.replace(`${location.pathname}?tab=${i2 !== undefined ? i2 : i1}`);

    const onDeleteSpace = ({ id, customId }) => {
        const spaceIndex = fightSpaces.findIndex(fs => fs.id === id || (customId && fs.customId === customId));
        const data = [ ...fightSpaces ];
        const [ currentSpace ] = data.splice(spaceIndex, 1);
        setFightSpaces([
            ...data,
            ...id ? [ { ...currentSpace, disabled: !(currentSpace.disabled === true) } ] : []
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

                {competition &&
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

function mapStateToProps (state) {
    return {
        competition : state.competitions.current,
        isLoading   : state.competitions.isLoading
    };
}

export default (CompetitionUpdate);
