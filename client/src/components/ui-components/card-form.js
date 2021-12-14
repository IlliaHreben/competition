import PropTypes from 'prop-types';
import {
    TextField, Select, FormHelperText,
    FormControl, InputLabel, MenuItem,
    Stack, Typography
    , FormGroup, Button
} from '@mui/material';
import { useState, useEffect, useReducer } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FighterModal from './fighter-modal';
import AdapterDateFns from '@mui/lab/AdapterLuxon';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import { getAgeFromBirthDate } from '../../utils/datetime';
import FighterAutocomplete from './fighter-autocomplete';
import WeightInput from './weight-mask-input';

CardForm.propTypes = {
    card     : PropTypes.object,
    isEdit   : PropTypes.bool,
    onChange : PropTypes.func.isRequired
};

function reducer (state, { type, payload }) {
    switch (type) {
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
    case 'reset':
        return payload;
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

const getInitialState = (card) => ({
    weight    : card?.weight || '',
    age       : card?.age || '',
    sectionId : card?.linked?.category?.linked?.section?.id || '',
    group     : card?.group || null,
    birthDate : card?.birthDate || ''
});
export default function CardForm ({ card, isEdit, onChange }) {
    const initialState = getInitialState(card);

    const dispatch = useDispatch();
    const { sections } = useSelector(mapState);

    const [ cardData, dispatchCard ] = useReducer(reducer, initialState);
    const [ errors, setErrors ] = useState({});
    const [ fighter, setFighter ] = useState(card?.linked?.fighter || {});
    const [ fighterModalStatus, setFighterModalStatus ] = useState(false);
    const changeFighterModalStatus = () => setFighterModalStatus(prev => !prev);

    useEffect(() => {
        dispatch({ type: 'reset', payload: getInitialState(card) });
        setFighter(card?.linked?.fighter);
    }, [ card, dispatch ]);

    useEffect(() => {
        onChange({
            fighterId: fighter?.id,
            ...cardData
        });
    }, [ fighter?.id, cardData, onChange ]);

    return (
        <FormGroup >
            <Typography variant="body1" gutterBottom>Main information</Typography>
            <FighterModal
                open={fighterModalStatus}
                fighter={fighter}
                errors={errors}
                handleClose={changeFighterModalStatus}
                isEdit={isEdit}
            />
            {isEdit
                ? (
                    <Stack direction="row" sx={{ mt: 1.5, mb: 1 }}>
                        <TextField
                            fullWidth
                            id="card-name-input"
                            label="Name"
                            value={card?.linked?.fighter?.name || ''}
                            sx={{ mr: 1.5 }}
                            disabled={!!isEdit}
                        />
                        <TextField
                            fullWidth
                            id="card-last-name-input"
                            label="Last name"
                            value={card?.linked?.fighter?.lastName || ''}
                            disabled={!!isEdit}
                        />
                    </Stack>
                )
                : (
                    <FighterAutocomplete
                        fighter={cardData.fighter}
                        onChange={setFighter}
                    />
                )
            }
            <Button variant="text" onClick={changeFighterModalStatus}>{isEdit ? 'Change' : 'Create'} fighter</Button>
            <Stack direction="row" sx={{ mb: 1.5, mt: 2 }}>
                <WeightInput
                    fullWidth
                    id="card-weight-input"
                    label="Weight"
                    value={cardData.weight}
                    onChange={value => dispatchCard({ type: 'weight', payload: value })}
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
