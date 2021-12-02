/* eslint-disable react/prop-types */
// import PropTypes              from 'prop-types';

import styles from './index.module.css';
import { LinkHorizontalStep } from '@visx/shape';
import { hierarchy, Tree } from '@visx/hierarchy';
import { Group } from '@visx/group';

import Fight from './fight';

function pleasantHexColorGenerator () {
    const threshold = 40;
    const min = 80 + threshold;
    const max = 250 - threshold;
    const firstNumber = getRandomInt(min, max);
    const secondNumber = firstNumber - threshold + getRandomInt(-40, 40);
    const thirdNumber = firstNumber + threshold + getRandomInt(-40, 40);
    return `#${shuffle([ firstNumber, secondNumber, thirdNumber ])
        .map(n => n.toString(16))
        .join('')}`;
}

function getRandomInt (min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function shuffle (array) {
    if (!Array.isArray(array)) throw new Error('Must be an array');
    let currentIndex = array.length;
    let randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [ array[currentIndex], array[randomIndex] ] = [
            array[randomIndex], array[currentIndex] ];
    }

    return array;
}

function findChildren (root, fights, colors) {
    const children = fights.filter(f => f.nextFightId === root.id);
    children.sort((a, b) => a.orderNumber - b.orderNumber);
    const node = {
        ...getCellValues(root, colors),
        visible: true
    };
    if (children.length) node.children = children.map(ch => findChildren(ch, fights, colors));
    if (node.children?.length === 1) node.children.unshift({ visible: false });

    return node;
}

function getCellValues (root, colors) {
    const firstFighterData = root.linked?.firstCard?.linked;
    const secondFighterData = root.linked?.secondCard?.linked;

    const getFullName = ({ name, lastName }) => `${name} ${lastName}`;
    const formatData = (data) => ({
        fullName   : getFullName(data.fighter),
        coach      : getFullName(data.coach),
        coachColor : colors[data.coach.id] || '#eeeeee',
        club       : data.club.name,
        clubColor  : colors[data.club.id] || '#eeeeee'
    });

    return {
        redCorner  : firstFighterData ? formatData(firstFighterData) : null,
        blueCorner : secondFighterData ? formatData(secondFighterData) : null
    };
}

function createFightersTree ({ cards, fights }) {
    let colors = {};
    cards.forEach(({ coachId, clubId }) => {
        colors[coachId] ? colors[coachId]++ : colors[coachId] = 1;
        colors[clubId] ? colors[clubId]++ : colors[clubId] = 1;
    });
    colors = Object.fromEntries(Object.entries(colors)
        .filter(([ , count ]) => count > 1)
        .map(([ id ]) => [ id, pleasantHexColorGenerator() ])
    );

    const root = fights.find(f => f.nextFightId === null);
    return findChildren(root, fights, colors);
}

const defaultMargin = { top: 0, left: 0, right: 0, bottom: 0 };

export default function FightTree ({
    width: totalWidth = 250,
    height: totalHeight = 260,
    margin = defaultMargin,
    category
}) {
    const fightersTree = createFightersTree(category.linked);

    const maxDegree = Math.log2(category.linked.fights.reduce((acc, { degree }) => degree > acc ? degree : acc, 0)) + 1;

    const innerWidth = (totalWidth - margin.left - margin.right) * maxDegree;
    const innerHeight = (totalHeight - margin.top - margin.bottom) * maxDegree;

    const origin = { x: 0, y: 0 };
    const sizeWidth = innerWidth;
    const sizeHeight = innerHeight;

    if (totalWidth < 10) return null;
    //
    return (
        <div className={styles.svgContainer}>
            <svg
                className={styles.svg}
                width={(totalWidth * maxDegree) + (maxDegree > 1 ? 80 : 0)}
                height={totalHeight * maxDegree}
            >
                <Group top={margin.top} left={margin.left}>
                    <Tree
                        root={hierarchy(fightersTree, (d) => (d.isExpanded ? null : d.children))}
                        size={[ sizeHeight, sizeWidth - 180 ]}
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
                                    {tree.links().map((link, i) => (
                                        descendants[i + 1].data.visible &&
                                        <LinkHorizontalStep
                                            key={i}
                                            data={link}
                                            percent={0.45}
                                            stroke="rgb(0,0,0)"
                                            strokeWidth="2"
                                            fill="none"
                                        />
                                    ))}
                                    {descendants.map((node, key) => {
                                        const top = node.x;
                                        const left = node.y;

                                        return (
                                            <Group top={top} left={left} key={key}>
                                                {node.data.visible &&
                                                <Fight
                                                    redCorner={node.data.redCorner}
                                                    blueCorner={node.data.blueCorner}
                                                />
                                                }
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
    );
}

// Graphic.propTypes = {
//     fights: PropTypes.arrayOf(PropTypes.shape({
//         id           : PropTypes.string.isRequired,
//         degree       : PropTypes.number.isRequired,
//         orderNumber  : PropTypes.number.isRequired,
//         firstCardId  : PropTypes.string.isRequired,
//         secondCardId : PropTypes.string.isRequired,
//         winnerId     : PropTypes.string.isRequired,
//         nextFightId  : PropTypes.string.isRequired,
//         categoryId   : PropTypes.string.isRequired,
//         fightSpaceId : PropTypes.string.isRequired,
//         executedAt   : PropTypes.string.isRequired,
//         createdAt    : PropTypes.string.isRequired,
//         updatedAt    : PropTypes.string.isRequired
//     })).isRequired
// };

// export default Graphic;
