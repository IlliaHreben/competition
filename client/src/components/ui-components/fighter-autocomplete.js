import PropTypes from 'prop-types';
import { useEffect, useState, useMemo } from 'react';
import debounce from 'lodash/debounce';
import {
    TextField, Autocomplete
} from '@mui/material';
import api from '../../api-singleton';

FighterAutocomplete.propTypes = {
    fighter  : PropTypes.object,
    onChange : PropTypes.func.isRequired
};

export default function FighterAutocomplete ({ fighter, onChange }) {
    const [ fighters, setFighters ] = useState([]);
    // const [ selectedFighter, setSelectedFighter ] = useState(null);
    const [ fighterInputValue, setFighterInputValue ] = useState('');

    const listDebounceFighters = useMemo(
        () =>
            debounce((run, search, selected) => {
                (async () => {
                    const { data } = await api.fighters.list({ search, limit: 10, include: 'club' });

                    if (run) {
                        let newOptions = [];

                        if (search && selected) {
                            newOptions = [ selected ];
                        }

                        if (data) {
                            newOptions = [ ...newOptions, ...data ];
                        }

                        setFighters(newOptions);
                    }
                })();
            }, 500),
        // we can't recalculate cause debounce won't work
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    useEffect(() => {
        let run = true;

        if (fighter) return;

        // if (fighterInputValue === '') {
        //     setFighters(selectedFighter ? [ selectedFighter ] : []);
        //     return;
        // }

        listDebounceFighters(run, fighterInputValue, fighter);

        return () => {
            run = false;
        };
    }, [ fighterInputValue, fighter, listDebounceFighters ]);

    return (
        <Autocomplete
            includeInputInList autoComplete
            blurOnSelect disableCloseOnSelect
            autoHighlight
            fullWidth
            options={fighters}
            sx={{ mb: 1 }}
            filterOptions={(x) => x}
            value={fighter}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            getOptionLabel={c => c ? `${c.lastName} ${c.name}` : ''}
            renderInput={(params) => <TextField {...params} label="Fighter" />}
            onChange={(e, newSelected) => {
                // setFighters(prev => ([ newSelected, ...prev ]));
                // setSelectedFighter(newSelected);
                onChange(newSelected);
            }}
            onInputChange={(event, newInputValue) => {
                setFighterInputValue(newInputValue);
            }}
        />
    );
}
