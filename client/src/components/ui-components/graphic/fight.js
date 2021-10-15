import PropTypes from 'prop-types';
// import toPath    from 'element-to-path';

import styles    from './index.module.css';

// const circle = {
//     type       : 'element',
//     name       : 'rect',
//     attributes : {
//         y           : -35,
//         height      : 35,
//         width       : 250,
//         fill        : '#ffffff',
//         stroke      : '#000000',
//         strokeWidth : 2
//         // rx          : 10
//     }
// };

// const path = toPath(circle);

function Fight ({ blueCornerName, redCornerName }) {
    return (
        <g className={styles.fight}>
            <path d='M0 -30 q0,-10 10,-10 H240 q10,0 10,10 V0 H0 V-30 z'

                y={-35}
                height={35}
                width={250}
                // y={-height / 2}
                // x={-width / 2}
                fill="#ffffff"
                stroke={'#000000'}
                strokeWidth={2}
            />

            <text
                dy={-13}
                dx={-125}
                fontSize={20}
                fontFamily="Arial"
                textAnchor="middle"
                style={{ pointerEvents: 'none' }}
                fill={'#26deb0'}
            >{redCornerName}
            </text>
            <path d='M0 30 q0,10 10,10 H240 q10,0 10,-10 V0 H0 V30 z'

                y={135}
                height={35}
                width={250}
                // y={-height / 2}
                // x={-width / 2}
                fill="#ffffff"
                stroke={'#000000'}
                strokeWidth={2}
            />

            <text
                dy={25}
                dx={-125}
                fontSize={20}
                fontFamily="Arial"
                textAnchor="middle"
                style={{ pointerEvents: 'none' }}
                fill={'#26deb0'}
            >{blueCornerName}
            </text>
        </g>
    );
}

Fight.propTypes = {
    blueCornerName : PropTypes.string.isRequired,
    redCornerName  : PropTypes.string.isRequired
};

export default Fight;
