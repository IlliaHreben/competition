import Modal from '../modal';
import PropTypes from 'prop-types';
import {
    TextField, Select, Divider,
    FormControl, InputLabel, MenuItem,
    Chip
} from '@mui/material';
import ListFields from '../list-fields';
import { useState, useEffect } from 'react';
import { omit } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { bulkCreate, deleteError } from '../../../actions/categories';
import { list as listSections } from '../../../actions/sections';
import { showSuccess, showError } from '../../../actions/errors';

CreateCategory.propTypes = {
    open          : PropTypes.bool.isRequired,
    handleClose   : PropTypes.func.isRequired,
    competitionId : PropTypes.string.isRequired
};

function mapStateToProps (state) {
    return {
        errors: state.categories.errors
    };
}

export default function CreateCategory ({ open, handleClose, competitionId }) {
    const state = useSelector(mapStateToProps);
    const [ name, setName ] = useState('');
    const [ type, setType ] = useState('full');
    const [ menSubCategories, setMenSubCategories ] = useState([ { from: '', to: '', nested: [] } ]);
    const [ womenSubCategories, setWomenSubCategories ] = useState([ { from: '', to: '', nested: [] } ]);
    const [ errors, setErrors ] = useState({});
    const dispatch = useDispatch();

    const handleChange = (e, field) => {
        const value = e.target.value;
        const fieldNameToState = {
            section : setName,
            type    : setType
        };

        if (state.errors[field]) dispatch(deleteError(field));
        checkOnErrors(value, field);
        fieldNameToState[field](value);
    };

    useEffect(() => {
        if (state.errors.data) {
            dispatch(showError('At least one age/weight category should be provided.'));
            dispatch(deleteError('data'));
        }
    }, [ dispatch, state.errors ]);

    const handleConfirm = () => {
        const categories = [
            ...dumpCategories(menSubCategories, 'man'),
            ...dumpCategories(womenSubCategories, 'woman')
        ];
        const data = {
            competitionId,
            section : name,
            type,
            data    : categories
        };
        dispatch(bulkCreate(data, () => {
            dispatch(listSections({ competitionId, include: [ 'categories' ] }));
            dispatch(showSuccess('Category has been successfully created.'));
            handleClose();
        }));
    };
    const dumpCategories = (data, sex) => {
        return data
            .filter(c => c.from || c.to)
            .flatMap(age => age.nested
                .filter(w => w.from || w.to)
                .map(weight => ({
                    weightFrom : +weight.from,
                    weightTo   : +weight.to,
                    ageFrom    : +age.from,
                    ageTo      : +age.to,
                    sex
                }))
            );
    };

    const checkOnErrors = (value, field) => {
        const message = fieldToCheckFn[field](value);
        if (message) setErrors({ ...errors, [field]: message });
        else if (errors[field]) setErrors(omit(errors, [ field ]));
    };

    const fieldToCheckFn = {
        section: section => {
            if (section.length < 2) {
                return 'Name must be at least 2 characters.';
            }
        }
    };

    return (
        <Modal
            handleClose={handleClose}
            handleConfirm={handleConfirm}
            open={open}
            title="Create category"
            fullWidth
        >
            <TextField
                required fullWidth
                id="category-name-input"
                label="Category name"
                value={name}
                onChange={e => handleChange(e, 'section')}
                error={!!(errors.section || state.errors.section)}
                helperText={errors.section || state.errors.section || ' '}
                sx={{ marginTop: '10px', marginBottom: '10px' }}
            >
            </TextField>
            <FormControl fullWidth>
                <InputLabel id="select-helper-label">Type</InputLabel>
                <Select
                    labelId="select-helper-label"
                    id="select-helper"
                    value={type}
                    label="Type"
                    onChange={e => setType(e.target.value)}
                >
                    <MenuItem value={'full'}>Full</MenuItem>
                    <MenuItem value={'light'}>Light</MenuItem>
                </Select>
            </FormControl>
            {getChip('Age categories - men')}
            <ListFields
                items={menSubCategories}
                handleChangeItems={setMenSubCategories}
                gap={1}
                sx={{ mb: 4 }}
            />
            {getChip('Age categories - women')}
            <ListFields
                items={womenSubCategories}
                handleChangeItems={setWomenSubCategories}
                gap={1}
            />
        </Modal>
    );
}

const getChip = text => (
    <Divider
        sx={{
            mb         : 2,
            mt         : 3,
            '::before' : { borderColor: 'rgb(189 189 189)' },
            '::after'  : { borderColor: 'rgb(189 189 189)' }
        }}
    >
        <Chip variant="outlined" size="small" label={text} />
    </Divider>
);
