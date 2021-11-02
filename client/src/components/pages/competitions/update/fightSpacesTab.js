
import PropTypes    from 'prop-types';
import { Fragment } from 'react';

import Button       from '@mui/material/Button';
import List         from '@mui/material/List';
import ListItem     from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Avatar       from '@mui/material/Avatar';
import IconButton   from '@mui/material/IconButton';
import Divider      from '@mui/material/Divider';
import Paper        from '@mui/material/Paper';
import DeleteIcon   from '@mui/icons-material/Delete';
import AddIcon      from '@mui/icons-material/Add';

import RingIcon     from '../../../../assets/icons/ring.png';
import TatamiIcon   from '../../../../assets/icons/tatami.png';

FightSpacesTab.propTypes = {
    fightSpaces: PropTypes.arrayOf(PropTypes.shape({
        id             : PropTypes.string,
        customId       : PropTypes.string,
        type           : PropTypes.string,
        orderNumber    : PropTypes.number,
        competitionDay : PropTypes.number
    }).isRequired),
    days          : PropTypes.number.isRequired,
    onDeleteSpace : PropTypes.func.isRequired,
    createSpace   : PropTypes.func.isRequired
};

export default function FightSpacesTab ({ onDeleteSpace, createSpace, ...props }) {
    const fightSpaces = Array.from({ length: props.days }).map((_, i) => {
        return props.fightSpaces
            .filter(fs => fs.competitionDay === i + 1)
            .sort((a, b) => b.orderNumber - a.orderNumber)
            .sort((a, b) => a.type < b.type ? 1 : -1);
    });

    const types = {
        ring   : 'Ring',
        tatami : 'Tatami'
    };

    return (
        <Paper sx={{ maxWidth: '500px', width: '100%' }}>
            <List
                sx={{
                    width   : '100%',
                    bgcolor : 'background.paper'
                }}
            >
                {fightSpaces.map((fs, i) => (
                    <Fragment key={i}>
                        {i > 0 && <Divider sx={{ marginTop: '2vh' }} />}
                        <ListItem
                            divider
                            secondaryAction={
                                <>
                                    {[ 'ring', 'tatami' ].map(type => (
                                        <Button
                                            key={type}
                                            onClick={() => createSpace(type, i + 1)}
                                            disabled={fs.some(f => f.type === type && f.disabled)}
                                        >
                                            {`Create ${type}`}
                                        </Button>
                                    ))}

                                </>
                            }
                        >
                            <ListItemText primary={`Competition day ${i + 1}`}/>
                        </ListItem>
                        {fs.map((f, k) => (
                            <ListItem
                                key={f.id || f.customId}
                                disabled={f.disabled}
                                secondaryAction={
                                    <IconButton
                                        // disabled={fs[k + 1]?.type === f.type && !fs[k + 1]?.disabled}
                                        disabled={f.disabled
                                            ? fs[k - 1]?.type === f.type && fs[k - 1]?.disabled
                                            : fs[k + 1]?.type === f.type && !fs[k + 1]?.disabled
                                        }
                                        edge="end"
                                        aria-label="delete"
                                        onClick={() => onDeleteSpace({ id: f.id, customId: f.customId })}
                                    >
                                        {f.disabled
                                            ? <AddIcon/>
                                            : <DeleteIcon />
                                        }
                                    </IconButton>
                                }
                            >
                                <ListItemIcon>
                                    <Avatar src={f.type === 'ring' ? RingIcon : TatamiIcon} variant="rounded" />
                                </ListItemIcon>
                                <ListItemText primary={`${types[f.type]} ${f.orderNumber}`} />
                            </ListItem>
                        ))}
                    </Fragment>
                ))}
            </List>
            <Button
                // disabled={disableUpdateButton}
                fullWidth
                variant="contained"
                size="large"
                // onClick={onSave}
            >Save
            </Button>
        </Paper>
    );
}
