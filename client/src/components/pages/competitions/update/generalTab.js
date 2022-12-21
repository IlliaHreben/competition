import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import Paper from '@mui/material/Paper';

import { update as updateCompetition } from 'actions/competitions';
import { showSuccess } from 'actions/errors';
import styles from './update.module.css';
import CompetitionForm from 'components/ui-components/competition-form';

GeneralSettingsTab.propTypes = {
  competition: PropTypes.object.isRequired
};

export default function GeneralSettingsTab(props) {
  const { competition } = props;

  const dispatch = useDispatch();

  const handleCompetitionSave = (data) => {
    dispatch(
      updateCompetition(
        competition.id,
        {
          name: data.name,
          description: data.description,
          startDate: data.startDate,
          endDate: data.endDate
        },
        () => dispatch(showSuccess('Competition was successfully changed.'))
      )
    );
  };

  return (
    <Paper
      className={styles.form}
      component='form'
      sx={{
        display: 'flex',
        flexDirection: 'column',
        '& > :not(style)': { m: 1.5 }
      }}
    >
      <CompetitionForm competition={competition} handleConfirm={handleCompetitionSave} />
    </Paper>
  );
}
