import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import { styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import SportsMmaIcon from '@mui/icons-material/SportsMma';

import PropTypes from 'prop-types';
import { useRef, useState, useEffect } from 'react';

import styles from './index.module.css';

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

function Fight ({ blueCorner, redCorner, onClickFighter, fight }) {
    const redCornerButton = redCorner &&
        <SportsMmaIcon sx={{ color: 'red', marginRight: '100%', marginLeft: 0 }} />;
    const blueCornerButton = blueCorner &&
        <SportsMmaIcon sx={{ color: 'blue', marginRight: '100%', marginLeft: 0 }} />;

    const buttons = [
        <ColorButton
            endIcon={redCornerButton}
            className={styles.svgButton}
            key="red"
            onClick={e => onClickFighter?.(e, redCorner.id, fight.id)}
        >{redCorner?.fullName || ''}
        </ColorButton>,
        <ColorButton
            endIcon={blueCornerButton}
            className={styles.svgButton}
            key="blue"
            onClick={e => onClickFighter?.(e, blueCorner.id, fight.id)}
        >{blueCorner?.fullName || ''}
        </ColorButton>
    ];
    const groupRef = useRef(null);
    const [ width, setDivWidth ] = useState(0);
    const [ height, setDivHeight ] = useState(0);

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
}

Fight.propTypes = {
    blueCorner     : PropTypes.object,
    redCorner      : PropTypes.object,
    onClickFighter : PropTypes.func,
    fight          : PropTypes.object
};

export default Fight;
