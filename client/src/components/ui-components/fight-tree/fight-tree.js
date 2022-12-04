import { useState, useMemo, useCallback } from 'react';
import styles from './index.module.css';
import SettingsPopover from '../settings-popover';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { useDispatch } from 'react-redux';
import { setWinner } from '../../../actions/fights';
import { showSuccess } from '../../../actions/errors';
import pleasantHexColorGenerator from '../../../utils/color-generator';
import { CustomMatchBracket } from './match-bracket';
import { PropTypes } from 'prop-types';

const getFullName = ({ name, lastName }) => `${lastName} ${name}`;
const formatData = ({ linked: { fighter }, ...card }, root, colors) => ({
  id: card.id,
  name: getFullName(fighter),
  coach: getFullName(fighter.linked.coach),
  coachColor: colors[fighter.coachId] || '#eeeeee',
  club: fighter.linked.club.name,
  clubColor: colors[fighter.clubId] || '#eeeeee',
  isWinner: card.id === root.winnerId,
  status: null, // 'PLAYED' | 'NO_SHOW' | 'WALK_OVER' | 'NO_PARTY' | null,
  resultText: 'WON' // Any string works
});

function getCellValues(root, colors) {
  const firstCardData = root.linked?.firstCard;
  const secondCardData = root.linked?.secondCard;

  return [
    firstCardData ? formatData(firstCardData, root, colors) : {},
    secondCardData ? formatData(secondCardData, root, colors) : {}
  ].filter(Boolean);
}

function createFightersTree({ cards, fights }) {
  let colors = {};
  cards.forEach(({ linked: { fighter } }) => {
    colors[fighter.coachId] ? colors[fighter.coachId]++ : (colors[fighter.coachId] = 1);
    colors[fighter.clubId] ? colors[fighter.clubId]++ : (colors[fighter.clubId] = 1);
  });
  colors = Object.fromEntries(
    Object.entries(colors)
      .filter(([, count]) => count > 1)
      .map(([id]) => [id, pleasantHexColorGenerator()])
  );

  return fights.map((f) => ({
    id: f.id,
    name: f.orderNumber,
    nextMatchId: f.nextFightId, // Id for the nextMatch in the bracket, if it's final match it must be null OR undefined
    degree: f.degree,
    tournamentRoundText: `1/${f.degree}`, // Text for Round Header
    // "startTime"           : "2021-05-30",
    state: 'DONE', // 'NO_SHOW' | 'WALK_OVER' | 'NO_PARTY' | 'DONE' | 'SCORE_DONE' Only needed to decide walkovers and if teamNames are TBD (to be decided)
    participants: getCellValues(f, colors),
    categoryId: f.categoryId
  }));
}

export default function FightTree({ width: totalWidth = 250, category }) {
  const linked = category.linked;
  const dispatch = useDispatch();

  const [fightersTree, setFightersTree] = useState(createFightersTree(linked));
  if (category.id === '460ca4be-3c21-43b7-813d-b1ea55a0821a') console.log(fightersTree, category);

  useMemo(() => setFightersTree(createFightersTree(linked)), [linked]);

  const [anchor, setAnchor] = useState(null);

  const handleClickParty = (e, fighterId, fightId) => {
    setAnchor({ element: e.currentTarget, fighterId, fightId });
  };

  const handleCloseSettings = () => {
    setAnchor(null);
  };

  const handleSetWinner = () => {
    dispatch(
      setWinner({ id: anchor.fightId, winnerId: anchor.fighterId }, () => {
        dispatch(showSuccess('The winner has been successfully set.'));
        handleCloseSettings();
      })
    );
  };

  const renderCustomMatchBracket = useCallback(
    ({ fightersTree }) => {
      const isBigBracket = fightersTree.length > 16;
      const spaceBetweenColumns = isBigBracket ? -40 : 100;
      const horizontalOffset = isBigBracket ? -175 : 0;
      const spaceBetweenRows = isBigBracket ? 75 : 10;
      const roundSeparatorWidth = isBigBracket ? 20 : 100;

      return (
        <CustomMatchBracket
          category={category}
          matches={fightersTree}
          handleClickParty={handleClickParty}
          options={{
            style: {
              connectorColor: '#000000',
              connectorColorHighlight: '#43a047d4',

              roundSeparatorWidth,
              lineInfo: {
                // separation: -13,
                // homeVisitorSpread: 0.5
              },
              // width: 400,
              horizontalOffset,
              spaceBetweenRows,
              canvasPadding: 50,
              spaceBetweenColumns
            }
          }}
        />
      );
    },
    [category]
  );

  const fightersTreeComponent = useMemo(
    () => renderCustomMatchBracket({ fightersTree }),
    [renderCustomMatchBracket, fightersTree]
  );

  if (totalWidth < 10) return null;
  return (
    <div className={styles.svgContainer}>
      <SettingsPopover
        anchorEl={anchor?.element}
        handleClose={handleCloseSettings}
        extraSettings={[
          {
            icon: <EmojiEventsIcon fontSize={'small'} />,
            onClick: handleSetWinner,
            text: { primary: 'Set winner' }
          }
        ]}
      />
      {fightersTreeComponent}
    </div>
  );
}

FightTree.propTypes = {
  width: PropTypes.number,
  category: PropTypes.object
};
