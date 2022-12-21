import MoveUpIcon from '@mui/icons-material/MoveUp';
import { PropTypes } from 'prop-types';

import SettingsPopover from 'components/ui-components/settings-popover';

export function CategorySettingsPopover({ selectedCardToMove, anchor, onClose, onMoveCard }) {
  return (
    <SettingsPopover
      anchorEl={anchor?.element}
      handleClose={onClose}
      extraSettings={[
        {
          disabled:
            !selectedCardToMove ||
            anchor?.category.linked.fights.some((f) =>
              [f.firstCardId, f.secondCardId].includes(selectedCardToMove.id)
            ),
          icon: <MoveUpIcon fontSize={'small'} />,
          onClick: () => {
            onClose();
            onMoveCard(anchor.category.id);
          },
          text: { primary: 'Move card to category' }
        }
      ]}
    />
  );
}
CategorySettingsPopover.propTypes = {
  // category: PropTypes.object,
  selectedCardToMove: PropTypes.object,
  anchor: PropTypes.object,
  onClose: PropTypes.func,
  onMoveCard: PropTypes.func
};

export function RowSettingsPopover({
  // category,
  selectedCardToMove,
  anchor,
  onClose,
  handleSelectToMove
}) {
  return (
    <SettingsPopover
      anchorEl={anchor?.element}
      handleClose={onClose}
      extraSettings={[
        {
          icon: <MoveUpIcon fontSize={'small'} />,
          onClick: handleSelectToMove,
          text: { primary: 'Select to move' }
        }
      ]}
    />
  );
}
RowSettingsPopover.propTypes = {
  // category: PropTypes.object,
  selectedCardToMove: PropTypes.object,
  anchor: PropTypes.object,
  onClose: PropTypes.func,
  onMoveCard: PropTypes.func,
  handleSelectToMove: PropTypes.func
};
