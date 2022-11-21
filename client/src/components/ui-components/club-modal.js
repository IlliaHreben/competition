import PropTypes from 'prop-types';
import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import curry from 'lodash/curry';
import debounce from 'lodash/debounce';
import { TextField, Autocomplete, Button } from '@mui/material';
import Modal from './modal';
import SettlementModal from './settlement-modal';
import { createClub, listClubs, updateClub } from '../../actions/clubs';
import { listCoaches } from '../../actions/coaches';
import { showSuccess } from '../../actions/errors';
import api from '../../api-singleton';

ClubModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  club: PropTypes.object,
  linked: PropTypes.object,
  isEdit: PropTypes.bool,
  handleComplete: PropTypes.func,
  card: PropTypes.object
};

function mapState(state) {
  return {
    settlements: state.settlements.list,
    coaches: state.coaches.list,
    active: state.competitions.active
  };
}

ClubModal.defaultProps = {
  club: {
    name: '',
    lastName: '',
    linked: {}
  },
  isEdit: false
};

export default function ClubModal({ club, isEdit, open, handleClose, handleComplete }) {
  const [_club, setClub] = useState({});
  const [_linked, setLinked] = useState({ coaches: [] });
  const { coaches, active } = useSelector(mapState);
  const [settlements, setSettlements] = useState([]);
  const [selectedSettlement, setSelectedSettlement] = useState(null);
  const [settlementInputValue, setSettlementInputValue] = useState('');

  useEffect(() => {
    if (!open) return;
    const linked = {
      coaches: club.linked.coaches || []
    };
    setClub(club);
    setLinked(linked);

    const cardSettlement = club.linked.settlement;
    setSettlements(cardSettlement ? [cardSettlement] : []);
    setSelectedSettlement(cardSettlement || null);
  }, [club, open]);

  const dispatch = useDispatch();

  const _handleConfirm = () => {
    const actionFunction = isEdit ? curry(updateClub)(club.id) : createClub;
    const data = { ..._club, settlementId: selectedSettlement?.id };

    dispatch(
      actionFunction(
        { data, linked: { ..._linked, coaches: _linked.coaches.map((c) => c.id) } },
        () => {
          dispatch(showSuccess(`Club has been successfully ${isEdit ? 'edited' : 'created'}.`));
          dispatch(listClubs({ competitionId: active.id, include: ['coaches', 'settlement'] }));
          dispatch(listCoaches({ competitionId: active.id, include: ['clubs'] }));
          handleComplete?.({ data: _club, _linked });
          handleClose();
        }
      )
    );
  };

  const listSettlements = useMemo(
    () =>
      debounce((run, search, selected) => {
        (async () => {
          const { data } = await api.settlements.list({ search, limit: 10 });

          if (run) {
            let newOptions = [];

            if (search && selected) {
              newOptions = [selected];
            }

            if (data) {
              newOptions = [...newOptions, ...data];
            }

            setSettlements(newOptions);
          }
        })();
      }, 500),
    // we can't recalculate cause debounce won't work
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    let run = true;

    if (settlementInputValue === '') {
      setSettlements(selectedSettlement ? [selectedSettlement] : []);
      return;
    }

    listSettlements(run, settlementInputValue, selectedSettlement);

    return () => {
      run = false;
    };
  }, [settlementInputValue, selectedSettlement, listSettlements]);

  const [settlementModalStatus, setSettlementModalStatus] = useState(false);
  const changeSettlementModalStatus = () => setSettlementModalStatus((prev) => !prev);

  return (
    <Modal
      handleClose={handleClose}
      handleConfirm={_handleConfirm}
      confirmButtonText={isEdit ? 'Save' : 'Create'}
      open={open}
      title={`${isEdit ? 'Edit' : 'Create'} club`}
      fullWidth
    >
      <SettlementModal open={settlementModalStatus} handleClose={changeSettlementModalStatus} />
      <TextField
        fullWidth
        autoComplete='new-password'
        id='coach-name-input'
        label='Name'
        value={_club.name}
        onChange={(e) => setClub((prev) => ({ ...prev, name: e.target.value }))}
        sx={{ mt: 1, mb: 1.5 }}
      />
      <Autocomplete
        includeInputInList
        multiple
        blurOnSelect
        disableCloseOnSelect
        autoHighlight
        fullWidth
        options={coaches}
        sx={{ mb: 1.5 }}
        value={coaches.filter((coach) => _linked.coaches.some((c) => c.id === coach.id))}
        getOptionLabel={(coach) => (coach ? `${coach.name} ${coach.lastName}` : '')}
        renderInput={(params) => <TextField {...params} label='Coaches' />}
        onChange={(e, options) => setLinked((prev) => ({ ...prev, coaches: options }))}
      />
      <Autocomplete
        includeInputInList
        autoComplete
        blurOnSelect
        disableCloseOnSelect
        autoHighlight
        filterSelectedOptions
        fullWidth
        options={settlements}
        sx={{ mb: 1 }}
        filterOptions={(x) => x}
        value={selectedSettlement}
        getOptionLabel={(s) => (s ? `${s.name}, ${s.linked.state?.name}` : '')}
        renderInput={(params) => <TextField {...params} label='Settlement' />}
        onChange={(e, newSelected) => {
          setSettlements((prev) => [newSelected, ...prev]);
          setSelectedSettlement(newSelected);
        }}
        onInputChange={(event, newInputValue) => {
          setSettlementInputValue(newInputValue);
        }}
      />
      <Button fullWidth onClick={changeSettlementModalStatus}>
        Create new settlement
      </Button>
    </Modal>
  );
}
