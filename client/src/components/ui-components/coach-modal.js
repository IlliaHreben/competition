import Modal from './modal';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import curry from 'lodash/curry';
import { createCoach, listCoaches, updateCoach } from '../../actions/coaches';
import { showSuccess } from '../../actions/errors';
import { TextField, Autocomplete, Stack } from '@mui/material';
import { listClubs } from '../../actions/clubs';

CoachModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  coach: PropTypes.object,
  linked: PropTypes.object,
  isEdit: PropTypes.bool,
  handleComplete: PropTypes.func,
  card: PropTypes.object
};

function mapState(state) {
  return {
    clubs: state.clubs.list,
    coaches: state.coaches.list,
    active: state.competitions.active
  };
}

CoachModal.defaultProps = {
  coach: {
    name: '',
    lastName: '',
    linked: {}
  },
  isEdit: false
};

export default function CoachModal({ coach, isEdit, open, handleClose, handleComplete }) {
  const [_coach, setCoach] = useState({});
  const [_linked, setLinked] = useState({ clubs: [] });
  const { clubs, active } = useSelector(mapState);

  useEffect(() => {
    if (!open) return;
    const linked = {
      clubs: coach.linked.clubs || []
    };
    setCoach(coach);
    setLinked(linked);
  }, [coach, open]);

  const dispatch = useDispatch();

  const _handleConfirm = () => {
    const actionFunction = isEdit ? curry(updateCoach)(coach.id) : createCoach;

    dispatch(
      actionFunction(
        { data: _coach, linked: { ..._linked, clubs: _linked.clubs.map((c) => c.id) } },
        () => {
          dispatch(showSuccess(`Coach has been successfully ${isEdit ? 'edited' : 'created'}.`));
          dispatch(listClubs({ competitionId: active.id, include: ['coaches', 'settlement'] }));
          dispatch(listCoaches({ competitionId: active.id, include: ['clubs'] }));
          handleComplete?.({ data: _coach, _linked });
          handleClose();
        }
      )
    );
  };

  return (
    <Modal
      handleClose={handleClose}
      handleConfirm={_handleConfirm}
      confirmButtonText="Create"
      open={open}
      title={`${isEdit ? 'Edit' : 'Create'} coach`}
      fullWidth
    >
      <Stack direction="row" sx={{ mt: 1, mb: 1.5 }}>
        <TextField
          fullWidth
          autoComplete="new-password"
          id="coach-name-input"
          label="Name"
          value={_coach.name}
          onChange={(e) => setCoach((prev) => ({ ...prev, name: e.target.value }))}
          sx={{ mr: 1.5 }}
        />
        <TextField
          fullWidth
          id="coach-last-name-input"
          label="Last name"
          value={_coach.lastName}
          onChange={(e) => setCoach((prev) => ({ ...prev, lastName: e.target.value }))}
        />
      </Stack>
      <Autocomplete
        includeInputInList
        multiple
        blurOnSelect
        disableCloseOnSelect
        autoHighlight
        fullWidth
        options={clubs}
        sx={{ mb: 1 }}
        value={clubs.filter((club) => _linked.clubs.some((c) => c.id === club.id))}
        getOptionLabel={(club) => club.name || ''}
        renderInput={(params) => <TextField {...params} label="Clubs" />}
        onChange={(e, options) => setLinked((prev) => ({ ...prev, clubs: options }))}
      />
    </Modal>
  );
}
