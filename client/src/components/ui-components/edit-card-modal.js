import Modal from './modal';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateCard } from 'actions/cards';
import { showSuccess } from 'actions/errors';
import CardFrom from './card-form';

EditCardModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleConfirm: PropTypes.func,
  card: PropTypes.object
};

export default function EditCardModal({ open, handleClose, handleConfirm, card }) {
  const [cardData, setCardData] = useState(card);

  useEffect(() => setCardData(card), [card, setCardData]);

  const dispatch = useDispatch();

  const _handleConfirm = () => {
    dispatch(
      updateCard(card.id, cardData, () => {
        dispatch(showSuccess('Card has been successfully updated.'));
        handleConfirm();
      })
    );
  };

  return (
    <Modal
      handleClose={handleClose}
      handleConfirm={_handleConfirm}
      open={open}
      title='Edit card'
      fullWidth
    >
      <CardFrom card={card} isEdit onChange={setCardData} />
    </Modal>
  );
}
