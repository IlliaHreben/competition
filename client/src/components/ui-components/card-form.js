import Modal from './modal';
import PropTypes from 'prop-types';
import {
    TextField, Select, Divider,
    FormControl, InputLabel, MenuItem,
    Autocomplete, Switch, Stack, Typography
    , FormGroup, FormControlLabel, Checkbox
} from '@mui/material';
import { useState, useEffect, useReducer } from 'react';
import { omit } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { bulkCreate, deleteError } from '../../actions/categories';
import { list as listSections } from '../../actions/sections';
import { showSuccess, showError } from '../../actions/errors';
import api from '../../api-singleton';
import AdapterDateFns from '@mui/lab/AdapterLuxon';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import { getAgeFromBirthDate } from '../../utils/datetime';

CardForm.propTypes = {
    card     : PropTypes.object,
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
            const { data } = await api.clubs.list({ competitionId: active.id, coachId: card.coachId });
            setClubs(data);
        })();
    }, [ active.id, card.coachId, clubs ]);

    useEffect(() => {
        if (!card.clubId) {
            setCoaches(coaches);
            return;
        }
        (async () => {
            const { data } = await api.coaches.list({ competitionId: active.id, clubId: card.clubId });
            setCoaches(data);
        })();
    }, [ active.id, card.clubId, coaches ]);

    return { coaches: _coaches, clubs: _clubs };
};

function reducer (state, { type, payload }) {
    switch (type) {
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

export default function CardForm ({ card, onChange }) {
    const initialState = {
        name      : card?.linked?.fighter?.name || '',
        lastName  : card?.linked?.fighter?.lastName || '',
        sex       : card?.linked?.fighter?.sex || '',
        weight    : card?.weight || '',
        age       : card?.age || '',
        sectionId : card?.linked?.category?.linked?.section?.id || '',
        group     : card?.group || null,
        birthDate : card?.birthDate || '',
        coachId   : card?.coachId || '',
        clubId    : card?.clubId || ''
    };

    const { cards, sections, active } = useSelector(mapState);

    const [ cardData, dispatchCard ] = useReducer(reducer, initialState);
    const { coaches, clubs } = useRelatedInfo(cardData);
    const [ selectFromExisted, setSelectFromExisted ] = useState(false);
    const [ errors, setErrors ] = useState({});

    useEffect(() => {
        onChange(cardData);
    }, [ cardData, onChange ]);

    return (
        <FormGroup >
            <Typography variant="body1" gutterBottom>Main information</Typography>
            <Typography variant="body2" gutterBottom>Please pay an attention that name, last name and sex will be changed for all cards associated with this fighter.</Typography>
            {/* <Divider sx={{ mb: 1.5 }}/> */}
            <Stack direction="row" sx={{ mt: 1.5 }}>
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
            <FormControlLabel
                sx={{ justifyContent: 'center', mb: 2, mt: 0.5 }}
                control={<Switch onChange={e => setSelectFromExisted(e.target.checked)}/>}
                label="Select from existed fighters"
            />
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
            <FormControlLabel control={<Checkbox defaultChecked />} label="Label" />
            <Stack direction="row" sx={{ mb: 1.5 }}>
                <TextField
                    fullWidth
                    id="card-name-input"
                    label="Weight"
                    value={cardData.weight}
                    onChange={e => dispatchCard({ type: 'weight', payload: e.target.value })}
                    error={!!errors.weight}
                    helperText={errors.weight}
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
                                helperText={errors.birthDate}
                            />}
                    />
                </LocalizationProvider>
            </Stack>
            <Stack direction="row" sx={{ mb: 1.5 }}>
                <FormControl fullWidth sx={{ mr: 1.5 }}>
                    <InputLabel id="card-name-input">Section</InputLabel>
                    <Select required
                        id="card-name-input"
                        label="Section"
                        value={cardData.sectionId}
                        onChange={e => {
                            dispatchCard({ type: 'sectionId', payload: e.target.value });
                            const section = sections.find(s => s.id === e.target.value);
                            if (!section || section.type !== 'light') return;
                            dispatchCard({ type: 'group', payload: null });
                        }}
                        error={!!errors.section}
                        helperText={errors.section}
                    >
                        {sections.map(s => <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>)}
                    </Select>
                </FormControl>
                <FormControl fullWidth >
                    <InputLabel id="card-name-input">Group</InputLabel>
                    <Select required
                        disabled={sections.find(s => s.id === cardData.sectionId)?.type !== 'full'}
                        id="card-last-name-input"
                        label="Group"
                        value={cardData.group}
                        onChange={e => dispatchCard({ type: 'group', payload: e.target.value })}
                        error={!!errors.group}
                        helperText={errors.group}
                    >
                        <MenuItem value={'A'}>A</MenuItem>
                        <MenuItem value={'B'}>B</MenuItem>
                    </Select>
                </FormControl>
            </Stack>
            <Typography sx={{ mt: 2 }} variant="body1" gutterBottom>Club and coach information</Typography>
            <Stack direction="row" sx={{ mt: 1 }}>
                <Autocomplete
                    includeInputInList
                    blurOnSelect
                    autoHighlight
                    fullWidth
                    options={coaches}
                    sx={{ mr: 1.5 }}
                    value={coaches.find(c => c.id === cardData.coachId) || ''}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    getOptionLabel={({ name, lastName }) => name ? `${name} ${lastName}` : ''}
                    renderInput={(params) => <TextField {...params} label="Coach" />}
                    onChange={(e, coach) => dispatchCard({ type: 'coachId', payload: coach?.id })}
                />
                <Autocomplete
                    includeInputInList
                    blurOnSelect
                    autoHighlight
                    fullWidth
                    options={clubs}
                    getOptionLabel={club => club.name || ''}
                    value={clubs.find(c => c.id === cardData.clubId) || ''}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    renderInput={(params) => <TextField {...params} label="Club" />}
                    onChange={(e, club) => dispatchCard({ type: 'clubId', payload: club?.id })}
                />
            </Stack>
        </FormGroup>
    );
}
