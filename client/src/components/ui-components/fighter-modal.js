import Modal from './modal';
import PropTypes from 'prop-types';
import { useState, useReducer, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateFighter, createFighter } from '../../actions/fighters';
// import { showSuccess } from '../../actions/errors';
import { showSuccess } from '../../actions/errors';
import CoachModal from './coach-modal';
import ClubModal from './club-modal';
import {
    TextField, Select,
    FormControl, InputLabel, MenuItem,
    Autocomplete, Switch, Stack, Typography
    , FormControlLabel, Button
} from '@mui/material';
import curry from 'lodash/curry';

FighterModal.propTypes = {
    open          : PropTypes.bool.isRequired,
    handleClose   : PropTypes.func.isRequired,
    isEdit        : PropTypes.bool,
    handleConfirm : PropTypes.func,
    fighter       : PropTypes.object,
    errors        : PropTypes.object
};
function mapState (state) {
    return {
        clubs    : state.clubs.list,
        coaches  : state.coaches.list,
        cards    : state.cards.list,
        sections : state.sections.list,
        active   : state.competitions.active
    };
}

const useRelatedInfo = card => {
    const { clubs, coaches, active } = useSelector(mapState);
    const [ _coaches, setCoaches ] = useState([]);
    const [ _clubs, setClubs ] = useState([]);

    useEffect(() => {
        if (!card.coachId && clubs) {
            setClubs(clubs);
            return;
        }
        (async () => {
            // const { data } = await api.clubs.list({ competitionId: active.id, coachId: card.coachId });
            const data = clubs.filter(club => club.linked.coaches?.some(c => c.id === card.coachId));
            setClubs(data);
        })();
    // we don't want to update on clubId changing but we want to prevent useless request when clubId doesn't exist
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ active?.id, card.coachId, clubs ]);

    useEffect(() => {
        if (!card.clubId && coaches) {
            setCoaches(coaches);
            return;
        }
        (async () => {
            // const { data } = await api.coaches.list({ competitionId: active.id, clubId: card.clubId });
            const data = coaches.filter(coach => coach.linked.clubs?.some(c => c.id === card.clubId));
            setCoaches(data);
        })();
    // we don't want to update on coachId changing but we want to prevent useless request when coachId doesn't exist
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ active?.id, card.clubId, coaches ]);

    return { coaches: _coaches, clubs: _clubs };
};

function reducer (state, { type, payload }) {
    switch (type) {
    case 'fighter':
        return { ...state, fighter: payload };
    case 'name':
        return { ...state, name: payload };
    case 'lastName':
        return { ...state, lastName: payload };
    case 'coachId':
        return { ...state, coachId: payload };
    case 'clubId':
        return { ...state, clubId: payload };
    case 'sex':
        return { ...state, sex: payload };
    case 'reset':
        return payload;
    default:
        throw new Error('Unknown type of dispatch - CardForm');
    }
}

export default function FighterModal ({ open, fighter, errors = {}, handleClose, isEdit }) {
    const initialState = {
        name     : fighter?.name || '',
        lastName : fighter?.lastName || '',
        sex      : fighter?.sex || '',
        coachId  : fighter?.coachId || '',
        clubId   : fighter?.clubId || ''
    };
    const [ cardData, dispatchFighter ] = useReducer(reducer, initialState);
    const { coaches, clubs } = useRelatedInfo(cardData);
    const [ recalculate, setRecalculate ] = useState(true);
    const { active } = useSelector(mapState);
    const dispatch = useDispatch();

    const handleConfirmFighter = () => {
        const actionFunction = isEdit
            ? curry(updateFighter)(fighter.id, recalculate, active.id)
            : createFighter;

        dispatch(actionFunction(
            {
                name     : cardData.name,
                lastName : cardData.lastName,
                sex      : cardData.sex,
                coachId  : cardData.coachId,
                clubId   : cardData.clubId
            },
            () => {
                dispatch(showSuccess(`Fighter has been successfully ${isEdit ? 'edited' : 'created'}.`));
                handleClose();
            }
        ));
    };

    const [ coachModalStatus, setCoachModalStatus ] = useState(false);
    const [ clubModalStatus, setClubModalStatus ] = useState(false);
    const changeClubModalStatus = () => setClubModalStatus(prev => !prev);
    const changeCoachModalStatus = () => setCoachModalStatus(prev => !prev);

    return (
        <Modal
            title={`${isEdit ? 'Edit' : 'Create'} fighter`}
            open={open}
            handleClose={handleClose}
            handleConfirm={handleConfirmFighter}
            confirmButtonText={isEdit ? 'Save' : 'Create'}
        >

            <CoachModal
                open={coachModalStatus}
                handleClose={changeCoachModalStatus}
                coach={coaches.find(c => c.id === cardData.coachId)}
                isEdit={!!cardData.coachId}
            />
            <ClubModal
                open={clubModalStatus}
                handleClose={changeClubModalStatus}
                club={clubs.find(c => c.id === cardData.clubId)}
                isEdit={!!cardData.clubId}
            />
            {isEdit &&
            <Typography
                variant="body2"
                gutterBottom
            >Please pay an attention that fighter&#39;s data will
                be changed for all cards associated with this fighter.
            </Typography>
            }
            <Stack direction="row" sx={{ mt: 1.5, mb: 1.5 }}>
                <TextField
                    fullWidth
                    id="card-n-input"
                    label="Name"
                    value={cardData.name}
                    onChange={e => dispatchFighter({ type: 'name', payload: e.target.value })}
                    error={!!errors.name}
                    helperText={errors.name}
                    sx={{ mr: 1.5 }}
                />
                <TextField
                    fullWidth
                    id="card-ln-input"
                    label="Last name"
                    value={cardData.lastName}
                    onChange={e => dispatchFighter({ type: 'lastName', payload: e.target.value })}
                    error={!!errors.lastName}
                    helperText={errors.lastName}
                />
            </Stack>
            <FormControl fullWidth>
                <InputLabel id="sex-label-input">Sex</InputLabel>
                <Select
                    labelId="sex-label-input"
                    id="sex-input"
                    label="Sex"
                    value={cardData.sex}
                    onChange={e => dispatchFighter({ type: 'sex', payload: e.target.value })}
                >
                    <MenuItem value="man">Man</MenuItem>
                    <MenuItem value="woman">Woman</MenuItem>
                </Select>
            </FormControl>
            {isEdit &&
            <FormControlLabel sx={{ justifyContent: 'center', mb: 2, mt: 0.5 }} control={(
                <Switch
                    checked={recalculate}
                    onChange={e => setRecalculate(e.target.checked)}
                />
            )} label="Recalculate categories"
            />
            }
            <Typography sx={{ mt: 1 }} variant="body1" gutterBottom>Club and coach information</Typography>
            <Stack direction="row" sx={{ mt: 1 }}>

                <Stack sx={{ mr: 1.5, width: '100%' }}>
                    <Autocomplete
                        includeInputInList
                        blurOnSelect autoSelect
                        autoHighlight
                        fullWidth
                        options={clubs}
                        sx={{ mb: 1 }}
                        getOptionLabel={club => club.name || ''}
                        value={clubs.find(c => c.id === cardData.clubId) || ''}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        renderInput={(params) => <TextField {...params} label="Club" />}
                        onChange={(e, club) => dispatchFighter({ type: 'clubId', payload: club?.id })}
                    />
                    <Button size="small" variant="text" onClick={changeClubModalStatus}>
                        {cardData.clubId ? 'Edit' : 'Create'} club
                    </Button>
                </Stack>
                <Stack sx={{ width: '100%' }}>
                    <Autocomplete
                        includeInputInList
                        blurOnSelect autoSelect
                        autoHighlight
                        fullWidth
                        options={coaches}
                        sx={{ mb: 1 }}
                        value={coaches.find(c => c.id === cardData.coachId) || ''}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        getOptionLabel={({ name, lastName }) => name ? `${lastName} ${name}` : ''}
                        renderInput={(params) => <TextField {...params} label="Coach" />}
                        onChange={(e, coach) => dispatchFighter({ type: 'coachId', payload: coach?.id })}
                    />

                    <Button size="small" variant="text" onClick={changeCoachModalStatus}>
                        {cardData.coachId ? 'Edit' : 'Create'} coach
                    </Button>
                </Stack>
            </Stack>
        </Modal>
    );
}
