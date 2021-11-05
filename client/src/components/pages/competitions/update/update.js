
import { useEffect, useState }       from 'react';
import SwipeableViews                from 'react-swipeable-views';
import PropTypes                     from 'prop-types';
import { useParams }                 from 'react-router';
import { useDispatch, useSelector }  from 'react-redux';

import Box                           from '@mui/material/Box';
import Tabs                          from '@mui/material/Tabs';
import Tab                           from '@mui/material/Tab';

import {
    show as showCompetition
    // update as updateCompetition
} from '../../../../actions/competitions';
import {
    list as listFightSpaces
} from '../../../../actions/fightSpaces';
import {
    list as listCategories
} from '../../../../actions/categories';
// import { showSuccess }               from '../../../../actions/errors';
import styles                        from './update.module.css';
import GeneralSettingsTab            from './generalTab';
import FightSpacesTab                from './fightSpacesTab';
import CategoriesTab                 from './categoriesTab';

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
    const { competition } = useSelector(mapStateToProps);
    const dispatch = useDispatch();

    const { id: competitionId } = useParams();

    useEffect(() => {
        dispatch(showCompetition(competitionId));
    }, [ competitionId, dispatch ]);

    useEffect(() => {
        if (!competition) return;
        dispatch(listFightSpaces(competition.id));
        dispatch(listCategories({ competitionId: competition.id, limit: 100000 }));
    }, [ competition, dispatch ]);

    useEffect(() => document.title = `Settings - ${competition ? competition.name : ''}`, [ competition ]);

    useEffect(() => {
        const queryTab = +(new URLSearchParams(location.search).get('tab'));
        setTab(queryTab || 0);
    }, [ location.search ]);

    const changeTab = (i1, i2) => history.replace(`${location.pathname}?tab=${i2 ?? i1}`);

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
                                competition={competition}
                            />
                        </TabPanel>
                        <TabPanel value={tab} index={1}>
                            <FightSpacesTab/>
                        </TabPanel>
                        <TabPanel value={tab} index={2}>
                            <CategoriesTab />
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
