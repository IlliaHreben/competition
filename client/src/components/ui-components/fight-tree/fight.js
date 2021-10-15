import Button                           from '@mui/material/Button';
import ButtonGroup                      from '@mui/material/ButtonGroup';
import { styled }                       from '@mui/material/styles';
import SportsMmaIcon                    from '@mui/icons-material/SportsMma';

import PropTypes                        from 'prop-types';
import { useRef, useState, useEffect }  from 'react';
// import toPath    from 'element-to-path';

import styles                           from './index.module.css';

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
const ColorButton = styled(Button)(({ theme }) => ({
    color           : theme.palette.getContrastText('#ffffff'),
    backgroundColor : '#ffffff',
    '&:hover'       : {
        backgroundColor : 'rgb(245, 245, 245)',
        border          : '2px solid !important'
    },
    border                  : '2px solid !important',
    '&:not(:first-of-type)' : {
        marginTop: '-2px !important'
    }
}));

function Fight ({ blueCornerName, redCornerName }) {
    const redCornerButton = redCornerName &&
        <SportsMmaIcon sx={{ color: 'red', marginRight: '100%', marginLeft: 0 }} />;
    const blueCornerButton = blueCornerName &&
        <SportsMmaIcon sx={{ color: 'blue', marginRight: '100%', marginLeft: 0 }} />;

    const buttons = [
        <ColorButton
            endIcon={redCornerButton}
            className={styles.svgButton}
            key="one"
        >{redCornerName}
        </ColorButton>,
        <ColorButton
            endIcon={blueCornerButton}
            className={styles.svgButton}
            key="two"
        >{blueCornerName}
        </ColorButton>
    ];
    const ref = useRef(null);
    const [ width, setWidth ] = useState(0);
    // const forceUpdate = useForceUpdate();
    useEffect(() => {
        setWidth(ref.current?.offsetWidth || 0);
        // forceUpdate();
    }, []);
    return (
        <foreignObject y="-37" width={width} height="100%">
            <ButtonGroup ref={ref}
                orientation="vertical"
                className={styles.svgButtonGroup}
                // variant="contained"
            >
                {buttons}
            </ButtonGroup>
        </foreignObject>
    );
    // return (
    //     <g className={styles.fight}>
    //         <path d='M0 -30 q0,-10 10,-10 H240 q10,0 10,10 V0 H0 V-30 z'

    //             y={-35}
    //             height={35}
    //             width={250}
    //             // y={-height / 2}
    //             // x={-width / 2}
    //             fill="#ffffff"
    //             stroke={'#000000'}
    //             strokeWidth={2}
    //         />
    //         <circle
    //             fill="#00000"
    //             cx="270" cy="-20" r="10"
    //         />

    //         <text
    //             dy={-13}
    //             dx={-125}
    //             fontSize={20}
    //             fontFamily="Arial"
    //             textAnchor="middle"
    //             style={{ pointerEvents: 'none' }}
    //             // fill={'#26deb0'}
    //         >{redCornerName}
    //         </text>
    //         <path d='M0 30 q0,10 10,10 H240 q10,0 10,-10 V0 H0 V30 z'

    //             y={135}
    //             height={35}
    //             width={250}
    //             // y={-height / 2}
    //             // x={-width / 2}
    //             fill="#ffffff"
    //             stroke={'#000000'}
    //             strokeWidth={2}
    //         />

    //         <text
    //             dy={25}
    //             dx={-125}
    //             fontSize={20}
    //             fontFamily="Arial"
    //             textAnchor="middle"
    //             style={{ pointerEvents: 'none' }}
    //             // fill={'#000000'}
    //         >{blueCornerName}
    //         </text>
    //     </g>
    // );
}

Fight.propTypes = {
    blueCornerName : PropTypes.string.isRequired,
    redCornerName  : PropTypes.string.isRequired,
    width          : PropTypes.number.isRequired
};

export default Fight;
