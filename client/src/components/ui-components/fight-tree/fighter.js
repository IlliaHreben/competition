import { Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useCallback } from 'react';
import { PropTypes } from 'prop-types';
import DraggableDroppable from '../draggable-droppable';
import { useDispatch } from 'react-redux';
import { showSuccess } from '../../../actions/errors';
import { switchCards } from '../../../actions/cards';
import { refreshCategories } from '../../../actions/categories';

const ColorButton = styled(Button)(({ theme }) => ({
  color: theme.palette.getContrastText('#ffffff'),
  backgroundColor: '#ffffff',
  '&:hover': {
    backgroundColor: 'rgb(245, 245, 245)',
    border: '2px solid !important'
  },
  border: '2px solid !important',
  '&:not(:first-of-type)': {
    marginTop: '-2px !important'
  }
}));

function Fighter({ party, position, match, resetCategory, category, children, ...props }) {
  const dispatch = useDispatch();

  const handleDrop = useCallback(
    (item) => {
      dispatch(
        switchCards(
          {
            first: { fightId: match.id, position },
            second: { fightId: item.match.id, position: item.position }
          },
          () => {
            dispatch(showSuccess('Participants has been successfully switched.'));
            dispatch(refreshCategories([...new Set([category.id, item.category.id])]));
          }
        )
      );
    },
    [category.id, dispatch, match.id, position]
  );

  return (
    <DraggableDroppable
      disableWrapper
      item={{ match, position, category }}
      onDrop={handleDrop}
      validateDrop={(item) =>
        !checkOnPrimacy({ match, position, category }) && !checkOnPrimacy(item)
      }
    >
      <ColorButton disableRipple {...props}>
        {children}
      </ColorButton>
    </DraggableDroppable>
  );
}

Fighter.propTypes = {
  fighter: PropTypes.object,
  match: PropTypes.object,
  resetCategory: PropTypes.func,
  children: PropTypes.any,
  position: PropTypes.string,
  party: PropTypes.object,
  category: PropTypes.object
};

export default Fighter;

function checkOnPrimacy({ match, position, category }) {
  const prevFightsLength = getPreviousFights(match, category.linked.fights).length;

  return prevFightsLength > 1 || (prevFightsLength === 1 && position === 'secondCardId');
}

function getPreviousFights(fight, fights) {
  return fights.reduce((acc, currentFight) => {
    if (currentFight.nextFightId === fight.id) {
      acc.push(currentFight);
    }
    return acc;
  }, []);
}
