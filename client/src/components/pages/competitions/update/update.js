import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useParams, useLocation } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import {
  show as showCompetition,
  clearShow
  // update as updateCompetition
} from 'actions/competitions';
import { list as listFightSpaces } from 'actions/fight-spaces';
import { list as listSections } from 'actions/sections';
// import { showSuccess }               from 'actions/errors';
import styles from './update.module.css';
import GeneralSettingsTab from './generalTab';
import FightSpacesTab from './fightSpacesTab';
import CategoriesTab from './categoriesTab';
import FightFormulasTab from './fight-formula-tab';
import { useNavigate } from 'react-router-dom';

function TabPanel(props) {
  const { children, value, index } = props;

  return (
    <Box
      sx={{ display: 'flex', justifyContent: 'center', p: 3 }}
      role='tabpanel'
      hidden={value !== index}
    >
      {value === index && children}
    </Box>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired
};

function CompetitionUpdate() {
  const location = useLocation();
  const [tab, setTab] = useState(+new URLSearchParams(location.search).get('tab'));
  const { competition } = useSelector(mapStateToProps);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { id: competitionId } = useParams();

  useEffect(() => {
    if (competitionId) dispatch(showCompetition(competitionId));
    return () => dispatch(clearShow());
  }, [competitionId, dispatch]);

  useEffect(() => {
    if (!competition) return;
    dispatch(listFightSpaces(competition.id));
    dispatch(listSections({ competitionId: competition.id, limit: 100000, include: 'categories' }));
  }, [competition, dispatch]);

  useEffect(() => {
    document.title = `Settings - ${competition ? competition.name : ''}`;
  }, [competition]);

  useEffect(() => {
    const queryTab = +new URLSearchParams(location.search).get('tab');
    setTab(queryTab || 0);
  }, [location.search]);

  const changeTab = (i1, i2) => navigate(`?tab=${i2 ?? i1}`, { replace: true });

  return (
    <div className={styles.page}>
      <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
        <Tabs value={tab} onChange={changeTab} centered>
          <Tab label='General' />
          <Tab label='Fight spaces' />
          <Tab label='Categories' />
          <Tab label='Fight formulas' />
        </Tabs>

        {competition && (
          <>
            <TabPanel value={tab} index={0}>
              <GeneralSettingsTab competition={competition} />
            </TabPanel>
            <TabPanel value={tab} index={1}>
              <FightSpacesTab />
            </TabPanel>
            <TabPanel value={tab} index={2}>
              <CategoriesTab />
            </TabPanel>
            <TabPanel value={tab} index={3}>
              <FightFormulasTab />
            </TabPanel>
          </>
        )}
      </Box>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    competition: state.competitions.current,
    isLoading: state.competitions.isLoading
  };
}

export default CompetitionUpdate;
