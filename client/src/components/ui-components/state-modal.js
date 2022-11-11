import Modal from './modal';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import api from '../../api-singleton';
import { showSuccess, showError } from '../../actions/errors';
import { TextField } from '@mui/material';
StateModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleConfirm: PropTypes.func
};

export default function StateModal({ open, handleClose, handleConfirm }) {
  const [stateName, setStateName] = useState('');
  const dispatch = useDispatch();

  const _handleConfirm = async () => {
    try {
      const { data } = await api.states.create({ data: { name: stateName } });
      dispatch(showSuccess(`${stateName} has been successfully created.`));
      handleConfirm?.(data);
      handleClose();
    } catch (err) {
      showError(err?.fields?.main || err);
    }
  };

  return (
    <Modal
      handleClose={handleClose}
      handleConfirm={_handleConfirm}
      confirmButtonText="Create"
      open={open}
      title={'Create state'}
      fullWidth
    >
      <TextField
        fullWidth
        autoComplete="new-password"
        id="coach-name-input"
        label="Name"
        value={stateName}
        onChange={(e) => setStateName(e.target.value)}
        sx={{ mb: 1.5, mt: 1 }}
      />
    </Modal>
  );
}
