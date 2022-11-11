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
import { createTheme } from '@g-loot/react-tournament-brackets';
import pleasantHexColorGenerator from '../../../utils/color-generator';
import { CustomMatchBracket } from './match';

const WhiteTheme = createTheme({
  textColor: { main: '#000000', highlighted: '#07090D', dark: '#3E414D' },
  matchBackground: { wonColor: '#daebf9', lostColor: '#96c6da' },
  score: {
    background: { wonColor: '#87b2c4', lostColor: '#87b2c4' },
    text: { highlightedWonColor: '#7BF59D', highlightedLostColor: '#FB7E94' }
  },
  border: {
    color: '#CED1F2',
    highlightedColor: '#da96c6'
  },
  roundHeader: { backgroundColor: '#da96c6', fontColor: '#000' },
  connectorColor: '#CED1F2',
  connectorColorHighlight: '#da96c6',
  svgBackground: '#FAFAFA'
});

function getCellValues(root, colors) {
  const firstCardData = root.linked?.firstCard;
  const secondCardData = root.linked?.secondCard;
  const getFullName = ({ name, lastName }) => `${lastName} ${name}`;
  const formatData = ({ linked: { fighter }, ...card }) => ({
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

  return [
    firstCardData ? formatData(firstCardData) : {},
    secondCardData ? formatData(secondCardData) : {}
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

const defaultMargin = { top: 0, left: 0, right: 0, bottom: 0 };

export default function FightTree({
  width: totalWidth = 250,
  height: totalHeight = 260,
  margin = defaultMargin,
  category
}) {
  const linked = category.linked;
  const dispatch = useDispatch();

  const [fightersTree, setFightersTree] = useState(createFightersTree(linked));
  if (category.id === '401d7bbc-344f-4989-b29f-1e56dc689239') console.log(fightersTree, category);

  useMemo(() => setFightersTree(createFightersTree(category.linked)), [category.linked]);

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

  const renderCustomMatchBracket = useCallback(
    ({ fightersTree }) => (
      <CustomMatchBracket
        theme={WhiteTheme}
        matches={fightersTree.map((f) => ({ ...f, state: 'NO_SHOW' }))}
        handleClickParty={handleClickParty}
        options={{
          style: {
            roundHeader: {
              backgroundColor: WhiteTheme.roundHeader.backgroundColor,
              fontColor: WhiteTheme.roundHeader.fontColor
            },
            connectorColor: WhiteTheme.connectorColor,
            connectorColorHighlight: WhiteTheme.connectorColorHighlight
          }
        }}
      />
    ),
    []
  );

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
