/* eslint-disable react/prop-types */
// import PropTypes              from 'prop-types';
import { useState, useMemo, useCallback } from 'react';
import styles from './index.module.css';
import SettingsPopover from '../settings-popover';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { useDispatch } from 'react-redux';
import { setWinner } from '../../../actions/fights';
import { showSuccess } from '../../../actions/errors';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
// import { createTheme } from '@g-loot/react-tournament-brackets';
import pleasantHexColorGenerator from '../../../utils/color-generator';
import { CustomMatchBracket } from './match-bracket';

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
    // "tournamentRoundText" : "4", // Text for Round Header
    // "startTime"           : "2021-05-30",
    state: 'DONE', // 'NO_SHOW' | 'WALK_OVER' | 'NO_PARTY' | 'DONE' | 'SCORE_DONE' Only needed to decide walkovers and if teamNames are TBD (to be decided)
    participants: getCellValues(f, colors)
  }));
}

// function switchPlaces(fights, fighter1, fighter2) {
//     const fight1 = fights.find(f => f.id === fighter1.fight.id);
//     const fight2 = fights.find(f => f.id === fighter2.fight.id);

//     const isFirst1 = fight1.firstCardId === fighter1.card.id;
//     const isFirst2 = fight2.firstCardId === fighter2.card.id;

//     const originalFighter1 = fight1.linked[isFirst1 ? 'firstCard' : 'secondCard'];
//     const originalFighter2 = fight2.linked[isFirst2 ? 'firstCard' : 'secondCard'];

//     if (isFirst1) {
//         fight1.firstCardId = fighter2.card.id;
//         fight1.linked.firstCard = originalFighter2;
//     } else {
//         fight1.secondCardId = fighter2.card.id;
//         fight1.linked.secondCard = originalFighter2;
//     }
//     if (isFirst2) {
//         fight2.firstCardId = fighter1.card.id;
//         fight2.linked.firstCard = originalFighter1;
//     } else {
//         fight2.secondCardId = fighter1.card.id;
//         fight2.linked.secondCard = originalFighter1;
//     }
//     return fights;

// }

// const defaultMargin = { top: 0, left: 0, right: 0, bottom: 0 };

export default function FightTree({
  width: totalWidth = 250,
  height: totalHeight = 260,
  // margin = defaultMargin,
  category
}) {
  const linked = category.linked;
  const dispatch = useDispatch();

  const [fightersTree, setFightersTree] = useState(createFightersTree(linked));
  if (category.id === '460ca4be-3c21-43b7-813d-b1ea55a0821a') console.log(fightersTree, category);

  useMemo(() => setFightersTree(createFightersTree(linked)), [linked]);

  // const resetCategory = () => setFightersTree(createFightersTree(linked));

  // const stepsCount = 1 + Math.log2(linked.fights
  //     .reduce((acc, { degree }) => degree > acc ? degree : acc, 0)
  // );

  // const innerWidth = (totalWidth - margin.left - margin.right) * stepsCount;
  // const innerHeight = (totalHeight - margin.top - margin.bottom) * stepsCount;

  // const origin = { x: 0, y: 0 };
  // const sizeWidth = innerWidth;
  // const sizeHeight = innerHeight;

  const [anchor, setAnchor] = useState(null);

  const handleClickParty = (e, fighterId, fightId) => {
    setAnchor({ element: e.currentTarget, fighterId, fightId });
  };

  const handleCloseSettings = () => {
    setAnchor(null);
  };
  // const onSwitchCards = (card1, card2) => {
  //     const fightsWithSwitchedCards = switchPlaces(JSON.parse(JSON.stringify(linked.fights)), card1, card2);
  //     const fightersTree = createFightersTree({ ...linked, fights: fightsWithSwitchedCards });
  //     setFightersTree(fightersTree);
  // };

  const handleSetWinner = () => {
    dispatch(
      setWinner({ id: anchor.fightId, winnerId: anchor.fighterId }, () => {
        dispatch(showSuccess('The winner has been successfully set.'));
        handleCloseSettings();
      })
    );
  };

  const renderCustomMatchBracket = useCallback(({ fightersTree }) => {
    const isBigBracket = fightersTree.length > 16;
    const spaceBetweenColumns = isBigBracket ? -40 : 100;
    const horizontalOffset = isBigBracket ? -175 : 0;
    const spaceBetweenRows = isBigBracket ? 75 : 10;
    const roundSeparatorWidth = isBigBracket ? 20 : 100;

    return (
      <CustomMatchBracket
        // theme={WhiteTheme}
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
  }, []);

  const fightersTreeComponent = useMemo(
    () => renderCustomMatchBracket({ fightersTree }),
    [renderCustomMatchBracket, fightersTree]
  );

  if (totalWidth < 10) return null;
  return (
    <DndProvider backend={HTML5Backend}>
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
    </DndProvider>
  );
}
