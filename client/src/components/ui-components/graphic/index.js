/* eslint-disable react/prop-types */
// import PropTypes              from 'prop-types';

import styles                 from './index.module.css';
import { LinkHorizontalStep } from '@visx/shape';
import { hierarchy, Tree }    from '@visx/hierarchy';
import { Group }              from '@visx/group';

import Fight                  from './fight';

function findChildren (root, fights) {
    const children = fights.filter(f => f.nextFightId === root.id);
    return {
        name: { redCornerName: root.firstCardId || 'red fighter', blueCornerName: root.secondCardId || 'blue fighter' },
        ...children.length && { children: children.map(ch => findChildren(ch, fights)) }
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
    fights = []
}) {
    // const forceUpdate = useForceUpdate();

    const fightersTree = createFightersTree(fights);
    console.log('='.repeat(50)); // !nocommit
    console.log(fightersTree);
    console.log('='.repeat(50));

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
                            console.log('='.repeat(50)); // !nocommit
                            console.log(a, b);
                            console.log('='.repeat(50));
                            return (a.parent === b.parent ? 1 : 0.5) / a.depth;
                        }}
                    >
                        {(tree) => (
                            <Group top={origin.y} left={origin.x}>
                                {tree.links().map((link, i) => (
                                    <LinkHorizontalStep
                                        key={i}
                                        data={link}
                                        percent={0.5}
                                        stroke="rgb(0,0,0)"
                                        strokeWidth="2"
                                        fill="none"
                                    />
                                ))}
                                {tree.descendants().map((node, key) => {
                                    const top = node.x;
                                    const left = node.y;

                                    return (
                                        <Group top={top} left={left} key={key}>
                                            {/* {node.depth !== 0 && (
                                                <rect
                                                    height={height}
                                                    width={width}
                                                    y={-height / 2}
                                                    x={-width / 2}
                                                    fill="#272b4d"
                                                    stroke={node.data.children ? '#03c0dc' : '#26deb0'}
                                                    strokeWidth={1}
                                                    strokeDasharray={node.data.children ? '0' : '2,2'}
                                                    strokeOpacity={node.data.children ? 1 : 0.6}
                                                    rx={node.data.children ? 0 : 10}
                                                    onClick={() => {
                                                        node.data.isExpanded = !node.data.isExpanded;
                                                        console.log(node);
                                                        // forceUpdate();
                                                    }}
                                                />
                                            )}
                                            <text
                                                dy=".33em"
                                                fontSize={9}
                                                fontFamily="Arial"
                                                textAnchor="middle"
                                                style={{ pointerEvents: 'none' }}
                                                fill={
                                                    node.depth === 0
                                                        ? '#71248e'
                                                        : node.children
                                                            ? 'white'
                                                            : '#26deb0'
                                                }
                                            >
                                                {JSON.stringify(node.data.name)}
                                            </text> */}
                                            <Fight
                                                redCornerName={node.data.name.redCornerName}
                                                blueCornerName={node.data.name.blueCornerName}
                                            />
                                        </Group>
                                    );
                                })}
                            </Group>
                        )}
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
