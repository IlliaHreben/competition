/* eslint-disable react/prop-types */
// import PropTypes              from 'prop-types';

import styles                 from './index.module.css';
import { LinkHorizontalStep } from '@visx/shape';
import { hierarchy, Tree }    from '@visx/hierarchy';
import { Group }              from '@visx/group';

import Fight                  from './fight';

function findChildren (root, fights) {
    const children = fights.filter(f => f.nextFightId === root.id);
    const node = {
        ...getCellValues(root),
        visible: true
    };
    if (children.length) node.children = children.map(ch => findChildren(ch, fights));
    if (node.children?.length === 1) node.children.unshift({ visible: false });

    return node;
}

function getCellValues (root) {
    const firstFighter = root.linked?.firstCard?.linked?.fighter;
    const secondFighter = root.linked?.secondCard?.linked?.fighter;
    return {
        redCornerName  : firstFighter ? `${firstFighter?.name} ${firstFighter?.lastName}` : '',
        blueCornerName : secondFighter ? `${secondFighter?.name} ${secondFighter?.lastName}` : ''
    };
}

function createFightersTree (fights) {
    const root = fights.find(f => f.nextFightId === null);
    return findChildren(root, fights);
}

const defaultMargin = { top: 30, left: 30, right: 30, bottom: 70 };

export default function FightTree ({
    width: totalWidth = 1200,
    height: totalHeight = 500,
    margin = defaultMargin,
    category
}) {
    const fightersTree = createFightersTree(category.linked.fights);

    const innerWidth = totalWidth - margin.left - margin.right;
    const innerHeight = totalHeight - margin.top - margin.bottom;

    const origin = { x: 0, y: 0 };
    const sizeWidth = innerWidth;
    const sizeHeight = innerHeight;

    if (totalWidth < 10) return null;
    return (
        <div className={styles.treeContainer}>
            <svg width={totalWidth} height={totalHeight}>
                <Group top={margin.top} left={margin.left}>
                    <Tree
                        root={hierarchy(fightersTree, (d) => (d.isExpanded ? null : d.children))}
                        size={[ sizeHeight, sizeWidth - 600 ]}
                        separation={(a, b) => {
                            return (a.parent === b.parent ? 1 : 0.5) / a.depth;
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
                                                    redCornerName={node.data.redCornerName}
                                                    blueCornerName={node.data.blueCornerName}
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
