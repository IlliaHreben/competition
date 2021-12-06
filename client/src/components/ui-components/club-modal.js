import Modal from './modal';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createClub, updateClub } from '../../actions/clubs';
import { showSuccess } from '../../actions/errors';
import {
    TextField, Autocomplete
} from '@mui/material';
import api from '../../api-singleton';

ClubModal.propTypes = {
    open           : PropTypes.bool.isRequired,
    handleClose    : PropTypes.func.isRequired,
    club           : PropTypes.object,
    linked         : PropTypes.object,
    isEdit         : PropTypes.bool,
    handleComplete : PropTypes.func,
    card           : PropTypes.object
};

function mapState (state) {
    return {
        settlements : state.settlements.list,
        coaches     : state.coaches.list
    };
}

ClubModal.defaultProps = {
    club: {
        name     : '',
        lastName : '',
        linked   : {}
    },
    isEdit: false
};

export default function ClubModal ({ club, isEdit, open, handleClose, handleComplete }) {
    const [ _club, setClub ] = useState({});
    const [ _linked, setLinked ] = useState({ coaches: [] });
    const { coaches } = useSelector(mapState);
    const [ settlements, setSettlements ] = useState([]);
    const [ selectedSettlement, setSelectedSettlement ] = useState(null);
    const [ settlementInputValue, setSettlementInputValue ] = useState('');

    useEffect(() => {
        if (!open) return;
        const linked = {
            coaches: club.linked.coaches || []
        };
        setClub(club);
        setLinked(linked);

        const cardSettlement = club.linked.settlement;
        if (cardSettlement) {
            setSettlements([ cardSettlement ]);
            setSelectedSettlement(cardSettlement);
        }
    }, [ club, open ]);

    const dispatch = useDispatch();

    const _handleConfirm = () => {
        const actionFunction = isEdit ? updateClub : createClub;

        dispatch(actionFunction(
            { data: _club, linked: { ..._linked, coaches: _linked.coaches.map(c => c.id) } },
            () => {
                dispatch(showSuccess(`Club has been successfully ${isEdit ? 'edited' : 'created'}.`));
                handleComplete?.({ data: _club, _linked });
                handleClose();
            }
        ));
    };

    useEffect(() => {
        let active = true;

        if (settlementInputValue === '') {
            setSettlements(selectedSettlement ? [ selectedSettlement ] : []);
            return;
        }

        (async () => {
            const { data } = await api.settlements.list({ search: settlementInputValue, limit: 10 });

            if (active) {
                let newOptions = [];

                if (settlementInputValue) {
                    newOptions = [ selectedSettlement ];
                }

                if (data) {
                    newOptions = [ ...newOptions, ...data ];
                }

                setSettlements(newOptions);
            }
        })();

        return () => {
            active = false;
        };
    }, [ settlementInputValue, selectedSettlement ]);

    return (
        <Modal
            handleClose={handleClose}
            handleConfirm={_handleConfirm}
            confirmButtonText={isEdit ? 'Save' : 'Create'}
            open={open}
            title={`${isEdit ? 'Edit' : 'Create'} club`}
            fullWidth
        >
            <TextField
                fullWidth
                autoComplete="new-password"
                id="coach-name-input"
                label="Name"
                value={_club.name}
                onChange={e => setClub(prev => ({ ...prev, name: e.target.value }))}
                sx={{ mt: 1, mb: 1.5 }}
            />
            <Autocomplete
                includeInputInList multiple
                blurOnSelect disableCloseOnSelect
                autoHighlight
                fullWidth
                options={coaches}
                sx={{ mb: 1.5 }}
                value={coaches.filter(coach => _linked.coaches.some(c => c.id === coach.id))}
                getOptionLabel={coach => coach ? `${coach.name} ${coach.lastName}` : ''}
                renderInput={(params) => <TextField {...params} label="Coaches" />}
                onChange={(e, options) => setLinked(prev => ({ ...prev, coaches: options }))}
            />
            <Autocomplete
                includeInputInList autoComplete
                blurOnSelect disableCloseOnSelect
                autoHighlight filterSelectedOptions
                fullWidth
                options={settlements}
                sx={{ mb: 1 }}
                filterOptions={(x) => x}
                value={selectedSettlement}
                getOptionLabel={s => s ? s.name : ''}
                renderInput={(params) => <TextField {...params} label="Settlement" />}
                onChange={(e, newSelected) => {
                    setSettlements(prev => ([ newSelected, ...prev ]));
                    setSelectedSettlement(newSelected);
                }}
                onInputChange={(event, newInputValue) => {
                    setSettlementInputValue(newInputValue);
                }}
            />
        </Modal>
    );
}
