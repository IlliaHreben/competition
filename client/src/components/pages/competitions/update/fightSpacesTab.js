import {
    useDispatch, useSelector
} from 'react-redux';
import {
    Fragment,
    useEffect,
    useState
} from 'react';
import Button          from '@mui/lab/LoadingButton';
import List            from '@mui/material/List';
import ListItem        from '@mui/material/ListItem';
import ListItemIcon    from '@mui/material/ListItemIcon';
import ListItemText    from '@mui/material/ListItemText';
import Avatar          from '@mui/material/Avatar';
import IconButton      from '@mui/material/IconButton';
import Divider         from '@mui/material/Divider';
import Paper           from '@mui/material/Paper';
import Typography      from '@mui/material/Typography';
import DeleteIcon      from '@mui/icons-material/Delete';
import AddIcon         from '@mui/icons-material/Add';

import RingIcon        from '../../../../assets/icons/ring.png';
import TatamiIcon      from '../../../../assets/icons/tatami.png';

import { bulkUpdate }  from '../../../../actions/fightSpaces';
import { showSuccess } from '../../../../actions/errors';
import { useParams }   from 'react-router';

const uuid = crypto.randomUUID.bind(crypto);

FightSpacesTab.propTypes = {
    // fightSpaces: PropTypes.arrayOf(PropTypes.shape({
    //     id             : PropTypes.string,
    //     customId       : PropTypes.string,
    //     type           : PropTypes.string,
    //     orderNumber    : PropTypes.number,
    //     competitionDay : PropTypes.number
    // }).isRequired),
    // days          : PropTypes.number.isRequired,
    // onDeleteSpace : PropTypes.func.isRequired,
    // createSpace   : PropTypes.func.isRequired
};

function mapStateToProps (state) {
    return {
        competition : state.competitions.current,
        fightSpaces : state.fightSpaces.list,
        isLoading   : state.fightSpaces.isLoading
    };
}

export default function FightSpacesTab () {
    const { competition, isLoading, ...store } = useSelector(mapStateToProps);

    const [ fightSpaces, setFightSpaces ] = useState(store.fightSpaces);

    const dispatch = useDispatch();

    function formatSpaces (days, fs) {
        return Array.from({ length: days }).map((_, i) => {
            return fs
                .filter(fs => fs.competitionDay === i + 1)
                .sort((a, b) => b.orderNumber - a.orderNumber)
                .sort((a, b) => a.type < b.type ? 1 : -1);
        });
    }

    useEffect(() => {
        setFightSpaces(store.fightSpaces);
    }, [ store.fightSpaces ]);

    const types = {
        ring   : 'Ring',
        tatami : 'Tatami'
    };

    const onDeleteSpace = ({ id, customId }) => {
        const spaceIndex = fightSpaces.findIndex(fs => (id && fs.id === id) || (customId && fs.customId === customId));
        const data = [ ...fightSpaces ];
        const [ currentSpace ] = data.splice(spaceIndex, 1);
        setFightSpaces([
            ...data,
            ...id ? [ { ...currentSpace, disabled: !(currentSpace.disabled === true) } ] : []
        ]);
    };

    const createSpace = (type, day) => {
        const spacesNumbers = fightSpaces
            .filter(s => s.type === type && s.competitionDay === day)
            .map(s => s.orderNumber);

        const orderNumber = spacesNumbers.length ? Math.max(...spacesNumbers) + 1 : 1;

        setFightSpaces([
            ...fightSpaces,
            {
                customId       : uuid(),
                competitionDay : day,
                type,
                orderNumber
            }
        ]);
    };

    const { id: competitionId } = useParams();

    const handleSave = () => {
        const payload = fightSpaces.filter(s => !s.disabled);
        dispatch(bulkUpdate(competitionId, payload,
            () => dispatch(showSuccess('Fight spaces has been successfully updated.'))
        ));
    };

    return (
        <Paper sx={{ maxWidth: '500px', width: '100%' }}>
            <List
                sx={{
                    width   : '100%',
                    bgcolor : 'background.paper'
                }}
            >
                {formatSpaces(competition.days, fightSpaces).map((fs, i) => (
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
                                <ListItemText
                                    primary={`${types[f.type]} ${f.type === 'ring' ? String.fromCharCode(64 + f.orderNumber) : f.orderNumber}`}
                                    secondary={!f.id &&
                                        <Typography
                                            sx={{ display: 'inline' }}
                                            component="span"
                                            variant="body2"
                                            color="#29af34"
                                        >
                                            new
                                        </Typography>
                                    }
                                />
                            </ListItem>
                        ))}
                    </Fragment>
                ))}
            </List>
            <Button
                // disabled={disableUpdateButton}
                sx={{ margin: '7px', width: '97%' }}
                fullWidth
                variant="contained"
                size="large"
                loading={isLoading}
                // loadingPosition="start"
                // loadingIndicator="Loading..."
                onClick={handleSave}
            >Save
            </Button>
        </Paper>
    );
}
