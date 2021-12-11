import PropTypes from 'prop-types';
import {
    TextField, Select, FormHelperText,
    FormControl, InputLabel, MenuItem,
    Autocomplete, Switch, Stack, Typography
    , FormGroup, FormControlLabel, Button
} from '@mui/material';
import { useState, useEffect, useReducer } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import curry from 'lodash/curry';
import { updateFighter, createFighter } from '../../actions/fighters';
import { showSuccess } from '../../actions/errors';
// import api from '../../api-singleton';
import AdapterDateFns from '@mui/lab/AdapterLuxon';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import { getAgeFromBirthDate } from '../../utils/datetime';
import Modal from './modal';
import CoachModal from './coach-modal';
import ClubModal from './club-modal';
import FighterAutocomplete from './fighter-autocomplete';

CardForm.propTypes = {
    card     : PropTypes.object,
    isEdit   : PropTypes.bool,
    onChange : PropTypes.func.isRequired
};

const useRelatedInfo = card => {
    const { clubs, coaches, active } = useSelector(mapState);
    const [ _coaches, setCoaches ] = useState([]);
    const [ _clubs, setClubs ] = useState([]);

    useEffect(() => {
        if (!card.coachId) {
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
    }, [ active.id, card.coachId, clubs ]);

    useEffect(() => {
        if (!card.clubId) {
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
    }, [ active.id, card.clubId, coaches ]);

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
    case 'sex':
        return { ...state, sex: payload };
    case 'weight':
        return { ...state, weight: payload };
    case 'age':
        return { ...state, age: payload };
    case 'sectionId':
        return { ...state, sectionId: payload };
    case 'group':
        return { ...state, group: payload };
    case 'birthDate':
        return { ...state, birthDate: payload };
    case 'coachId':
        return { ...state, coachId: payload };
    case 'clubId':
        return { ...state, clubId: payload };
    default:
        throw new Error('Unknown type of dispatch - CardForm');
    }
}
function mapState (state) {
    return {
        clubs    : state.clubs.list,
        coaches  : state.coaches.list,
        cards    : state.cards.list,
        sections : state.sections.list,
        active   : state.competitions.active
    };
}

export default function CardForm ({ card, isEdit, onChange }) {
    const initialState = {
        fighter     : card?.linked?.fighter || null,
        name        : card?.linked?.fighter?.name || '',
        lastName    : card?.linked?.fighter?.lastName || '',
        sex         : card?.linked?.fighter?.sex || '',
        weight      : card?.weight || '',
        age         : card?.age || '',
        sectionId   : card?.linked?.category?.linked?.section?.id || '',
        group       : card?.group || null,
        birthDate   : card?.birthDate || '',
        coachId     : card?.linked?.fighter?.coachId || '',
        clubId      : card?.linked?.fighter?.clubId || '',
        recalculate : true
    };
    const dispatch = useDispatch();
    const { sections, active } = useSelector(mapState);

    const [ cardData, dispatchCard ] = useReducer(reducer, initialState);
    const { coaches, clubs } = useRelatedInfo(cardData);
    const [ errors, setErrors ] = useState({});
    const [ fighterModalStatus, setFighterModalStatus ] = useState(false);
    const [ recalculate, setRecalculate ] = useState(true);
    const changeFighterModalStatus = () => setFighterModalStatus(prev => !prev);

    const handleConfirmFighter = () => {
        const actionFunction = isEdit
            ? curry(updateFighter)(card.linked.fighter.id, recalculate, active.id)
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
                changeFighterModalStatus();
            }
        ));
    };

    useEffect(() => {
        onChange(cardData);
    }, [ cardData, onChange ]);

    const [ coachModalStatus, setCoachModalStatus ] = useState(false);
    const [ clubModalStatus, setClubModalStatus ] = useState(false);
    const changeClubModalStatus = () => setClubModalStatus(prev => !prev);
    const changeCoachModalStatus = () => setCoachModalStatus(prev => !prev);

    return (
        <FormGroup >
            <Typography variant="body1" gutterBottom>Main information</Typography>
            <Modal
                title={`${isEdit ? 'Edit' : 'Create'} fighter`}
                open={fighterModalStatus}
                handleClose={changeFighterModalStatus}
                handleConfirm={handleConfirmFighter}
                confirmButtonText={isEdit ? 'Save' : 'Create'}
            >
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
                        id="card-name-input"
                        label="Name"
                        value={cardData.name}
                        onChange={e => dispatchCard({ type: 'name', payload: e.target.value })}
                        error={!!errors.name}
                        helperText={errors.name}
                        sx={{ mr: 1.5 }}
                    />
                    <TextField
                        fullWidth
                        id="card-last-name-input"
                        label="Last name"
                        value={cardData.lastName}
                        onChange={e => dispatchCard({ type: 'lastName', payload: e.target.value })}
                        error={!!errors.lastName}
                        helperText={errors.lastName}
                    />
                </Stack>
                {/* <FormControlLabel
                    sx={{ justifyContent: 'center', mb: 2, mt: 0.5 }}
                    control={<Switch onChange={e => setSelectFromExisted(e.target.checked)}/>}
                    label="Select from existed fighters"
                /> */}
                <FormControl fullWidth>
                    <InputLabel id="sex-label-input">Sex</InputLabel>
                    <Select
                        labelId="sex-label-input"
                        id="sex-input"
                        label="Sex"
                        value={cardData.sex}
                        onChange={e => dispatchCard({ type: 'sex', payload: e.target.value })}
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
                {/* <FormControlLabel control={<Checkbox defaultChecked />} label="Label" /> */}
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
                            onChange={(e, club) => dispatchCard({ type: 'clubId', payload: club?.id })}
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
                            getOptionLabel={({ name, lastName }) => name ? `${name} ${lastName}` : ''}
                            renderInput={(params) => <TextField {...params} label="Coach" />}
                            onChange={(e, coach) => dispatchCard({ type: 'coachId', payload: coach?.id })}
                        />

                        <Button size="small" variant="text" onClick={changeCoachModalStatus}>
                            {cardData.coachId ? 'Edit' : 'Create'} coach
                        </Button>
                    </Stack>
                </Stack>
            </Modal>
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
            {isEdit
                ? (
                    <Stack direction="row" sx={{ mt: 1.5, mb: 1 }}>
                        <TextField
                            fullWidth
                            id="card-name-input"
                            label="Name"
                            value={cardData.name}
                            sx={{ mr: 1.5 }}
                            disabled={!!isEdit}
                        />
                        <TextField
                            fullWidth
                            id="card-last-name-input"
                            label="Last name"
                            value={cardData.lastName}
                            disabled={!!isEdit}
                        />
                    </Stack>
                )
                : (
                    <FighterAutocomplete
                        fighter={cardData.fighter}
                        onChange={fighter => dispatchCard({ type: 'fighter', payload: fighter })}
                    />
                )
            }
            <Button variant="text" onClick={changeFighterModalStatus}>{isEdit ? 'Change' : 'Create'} fighter</Button>
            <Stack direction="row" sx={{ mb: 1.5, mt: 2 }}>
                <TextField
                    fullWidth
                    id="card-name-input"
                    label="Weight"
                    value={cardData.weight}
                    onChange={e => dispatchCard({ type: 'weight', payload: e.target.value })}
                    error={!!errors.weight}
                    helperText={errors.weight || null}
                    sx={{ mr: 1.5 }}
                />
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                        label={`Birth date${cardData.birthDate ? ` (${getAgeFromBirthDate(cardData.birthDate)})` : ''}`}
                        value={cardData.birthDate}
                        onChange={value => dispatchCard({ type: 'birthDate', payload: value })}
                        renderInput={(params) =>
                            <TextField
                                fullWidth
                                {...params}
                                error={!!errors.birthDate}
                                // helperText={errors.birthDate}
                            />}
                    />
                </LocalizationProvider>
            </Stack>
            <Stack direction="row">
                <FormControl fullWidth sx={{ mr: 1.5 }} error={!!errors.section}>
                    <InputLabel id="card-name-input">Section</InputLabel>
                    <Select required
                        id="card-name-input"
                        label="Section"
                        value={cardData.sectionId || ''}
                        onChange={e => {
                            dispatchCard({ type: 'sectionId', payload: e.target.value });
                            const section = sections.find(s => s.id === e.target.value);
                            if (!section || section.type !== 'light') return;
                            dispatchCard({ type: 'group', payload: null });
                        }}
                    >
                        {sections.map(s => <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>)}
                    </Select>
                    {errors.section && <FormHelperText>{errors.section}</FormHelperText>}
                </FormControl>
                <FormControl
                    fullWidth error={!!errors.group}
                    disabled={sections.find(s => s.id === cardData.sectionId)?.type !== 'full'}
                >
                    <InputLabel id="card-name-input">Group</InputLabel>
                    <Select required
                        id="card-last-name-input"
                        label="Group"
                        value={cardData.group || ''}
                        onChange={e => dispatchCard({ type: 'group', payload: e.target.value })}
                    >
                        <MenuItem value={'A'}>A</MenuItem>
                        <MenuItem value={'B'}>B</MenuItem>
                    </Select>
                    {errors.group && <FormHelperText>{errors.group}</FormHelperText>}
                </FormControl>
            </Stack>
        </FormGroup>
    );
}
