/* eslint-disable react/prop-types */
// import PropTypes              from 'prop-types';
import { useState, useMemo } from 'react';
import styles from './index.module.css';
import { LinkHorizontalStep } from '@visx/shape';
import { hierarchy, Tree } from '@visx/hierarchy';
import { Group } from '@visx/group';
import SettingsPopover from '../settings-popover';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import Fight from './fight';
import { useDispatch } from 'react-redux';
import { setWinner } from '../../../actions/fights';
import { showSuccess } from '../../../actions/errors';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

function pleasantHexColorGenerator() {
  const threshold = 40;
  const min = 80 + threshold;
  const max = 250 - threshold;
  const firstNumber = getRandomInt(min, max);
  const secondNumber = firstNumber - threshold + getRandomInt(-40, 40);
  const thirdNumber = firstNumber + threshold + getRandomInt(-40, 40);
  return `#${shuffle([firstNumber, secondNumber, thirdNumber])
    .map((n) => n.toString(16))
    .join('')}`;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function shuffle(array) {
  if (!Array.isArray(array)) throw new Error('Must be an array');
  let currentIndex = array.length;
  let randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }

  return array;
}

function findChildren(root, fights, colors) {
  const children = fights.filter((f) => f.nextFightId === root.id);
  children.sort((a, b) => a.orderNumber - b.orderNumber);
  const node = {
    ...getCellValues(root, colors),
    visible: true
  };
  if (children.length) node.children = children.map((ch) => findChildren(ch, fights, colors));
  if (node.children?.length === 1) node.children.unshift({ visible: false });

  return node;
}

function getCellValues(root, colors) {
  const firstCardData = root.linked?.firstCard;
  const secondCardData = root.linked?.secondCard;
  const getFullName = ({ name, lastName }) => `${lastName} ${name}`;
  const formatData = ({ linked: { fighter }, ...card }) => ({
    id: card.id,
    fullName: getFullName(fighter),
    coach: getFullName(fighter.linked.coach),
    coachColor: colors[fighter.coachId] || '#eeeeee',
    club: fighter.linked.club.name,
    clubColor: colors[fighter.clubId] || '#eeeeee'
  });

  return {
    fight: root,
    redCorner: firstCardData ? formatData(firstCardData) : null,
    blueCorner: secondCardData ? formatData(secondCardData) : null
  };
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

  const root = fights.find((f) => f.nextFightId === null);
  return findChildren(root, fights, colors);
}

function switchPlaces(fights, fighter1, fighter2) {
  // console.log('_'.repeat(50)); // !nocommit
  // console.log(fights, fighter1, fighter2);
  // console.log('_'.repeat(50));
  const fight1 = fights.find((f) => f.id === fighter1.fight.id);
  const fight2 = fights.find((f) => f.id === fighter2.fight.id);

  const isFirst1 = fight1.firstCardId === fighter1.card.id;
  const isFirst2 = fight2.firstCardId === fighter2.card.id;

  const originalFighter1 = fight1.linked[isFirst1 ? 'firstCard' : 'secondCard'];
  const originalFighter2 = fight2.linked[isFirst2 ? 'firstCard' : 'secondCard'];

  if (isFirst1) {
    fight1.firstCardId = fighter2.card.id;
    fight1.linked.firstCard = originalFighter2;
  } else {
    fight1.secondCardId = fighter2.card.id;
    fight1.linked.secondCard = originalFighter2;
  }
  if (isFirst2) {
    fight2.firstCardId = fighter1.card.id;
    fight2.linked.firstCard = originalFighter1;
  } else {
    fight2.secondCardId = fighter1.card.id;
    fight2.linked.secondCard = originalFighter1;
  }

  // console.log('+'.repeat(50)); // !nocommit
  // console.log(fights);
  // console.log('+'.repeat(50));
  return fights;
}

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

  useMemo(() => setFightersTree(createFightersTree(linked)), [linked]);

  const resetCategory = () => setFightersTree(createFightersTree(linked));

  const stepsCount =
    1 + Math.log2(linked.fights.reduce((acc, { degree }) => (degree > acc ? degree : acc), 0));

  const innerWidth = (totalWidth - margin.left - margin.right) * stepsCount;
  const innerHeight = (totalHeight - margin.top - margin.bottom) * stepsCount;

  const origin = { x: 0, y: 0 };
  const sizeWidth = innerWidth;
  const sizeHeight = innerHeight;

  const [anchor, setAnchor] = useState(null);

  const handleClickFighter = (e, fighterId, fightId) => {
    setAnchor({ element: e.currentTarget, fighterId, fightId });
  };
  const handleCloseSettings = () => {
    setAnchor(null);
  };
  const onSwitchCards = (card1, card2) => {
    const fightsWithSwitchedCards = switchPlaces(
      JSON.parse(JSON.stringify(linked.fights)),
      card1,
      card2
    );
    const fightersTree = createFightersTree({ ...linked, fights: fightsWithSwitchedCards });
    setFightersTree(fightersTree);
  };

  const handleSetWinner = () => {
    dispatch(
      setWinner({ id: anchor.fightId, winnerId: anchor.fighterId }, () => {
        dispatch(showSuccess('The winner has been successfully set.'));
        handleCloseSettings();
      })
    );
  };

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
        <svg
          className={styles.svg}
          width={totalWidth * stepsCount + (stepsCount > 1 ? 80 : 0)}
          height={totalHeight * stepsCount}
        >
          <Group top={margin.top} left={margin.left}>
            <Tree
              root={hierarchy(fightersTree, (d) => (d.isExpanded ? null : d.children))}
              size={[sizeHeight, sizeWidth - 180]}
              separation={(a, b) => {
                const hasChildren = a.children && b.children;
                const value = hasChildren ? 1 : 0.95;
                return a.parent === b.parent ? value : 1;
              }}
            >
              {(tree) => {
                const descendants = tree.descendants();
                return (
                  <Group top={origin.y} left={origin.x}>
                    {tree
                      .links()
                      .map(
                        (link, i) =>
                          descendants[i + 1].data.visible && (
                            <LinkHorizontalStep
                              key={i}
                              data={link}
                              percent={0.45}
                              stroke="rgb(0,0,0)"
                              strokeWidth="2"
                              fill="none"
                            />
                          )
                      )}
                    {descendants.map((node, key) => {
                      const top = node.x;
                      const left = node.y;

                      return (
                        <Group top={top} left={left} key={key}>
                          {node.data.visible && (
                            <Fight
                              fight={node.data.fight}
                              redCorner={node.data.redCorner}
                              blueCorner={node.data.blueCorner}
                              onClickFighter={handleClickFighter}
                              onSwitchCards={onSwitchCards}
                              onReset={resetCategory}
                            />
                          )}
                        </Group>
                      );
                    })}
                  </Group>
                );
              }}
            </Tree>
          </Group>
        </svg>
      </div>
    </DndProvider>
  );
}
