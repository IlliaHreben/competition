import Button                                     from '@mui/material/Button';
import ButtonGroup                                from '@mui/material/ButtonGroup';
import { styled }                                 from '@mui/material/styles';
import Chip                                       from '@mui/material/Chip';
import Stack                                      from '@mui/material/Stack';
import SportsMmaIcon                              from '@mui/icons-material/SportsMma';

import PropTypes                                  from 'prop-types';
import { useRef, useState, useEffect }            from 'react';
// import toPath    from 'element-to-path';

import styles                                     from './index.module.css';

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

function Fight ({ blueCorner, redCorner }) {
    const redCornerButton = redCorner &&
        <SportsMmaIcon sx={{ color: 'red', marginRight: '100%', marginLeft: 0 }} />;
    const blueCornerButton = blueCorner &&
        <SportsMmaIcon sx={{ color: 'blue', marginRight: '100%', marginLeft: 0 }} />;

    const buttons = [
        <ColorButton
            endIcon={redCornerButton}
            className={styles.svgButton}
            key="one"
        >{redCorner?.fullName || ''}
        </ColorButton>,
        <ColorButton
            endIcon={blueCornerButton}
            className={styles.svgButton}
            key="two"
        >{blueCorner?.fullName || ''}
        </ColorButton>
    ];
    const groupRef = useRef(null);
    const [ width, setDivWidth ] = useState(0);
    const [ height, setDivHeight ] = useState(0);
    // const forceUpdate = useForceUpdate();
    useEffect(() => {
        setDivWidth(groupRef.current?.offsetWidth || 0);
        setDivHeight(groupRef.current?.offsetHeight || 0);
    }, []);

    return (
        <foreignObject y="-61" width={width} height={height + 48}>
            <div
                style={{ width: `${width}px`, height: `${height + 48}px`, justifyContent: !blueCorner && redCorner ? 'flex-start' : 'center' }}
                className={styles.fightContainer}
            >
                {redCorner &&
                    <Stack direction="row" spacing={3}>
                        <Chip
                            label={redCorner.coach || ''}
                            style={{ backgroundColor: redCorner.coachColor }}
                            size="small"
                        />
                        <Chip
                            label={redCorner.club || ''}
                            style={{ backgroundColor: redCorner.clubColor }}
                            size="small"
                        />
                    </Stack>
                }
                <ButtonGroup ref={groupRef}
                    orientation="vertical"
                    className={styles.svgButtonGroup}
                // variant="contained"
                >
                    {buttons}
                </ButtonGroup>
                {blueCorner &&
                    <Stack direction="row" spacing={3}>
                        <Chip
                            label={blueCorner.coach || ''}
                            style={{ backgroundColor: blueCorner.coachColor }}
                            size="small"
                        />
                        <Chip
                            label={blueCorner.club || ''}
                            style={{ backgroundColor: blueCorner.clubColor }}
                            size="small"
                        />
                    </Stack>
                }
            </div>
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
    blueCorner : PropTypes.object,
    redCorner  : PropTypes.object,
    width      : PropTypes.number.isRequired
};

export default Fight;
