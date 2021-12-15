import Modal from './modal';
import PropTypes from 'prop-types';
import { useEffect, useState, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import StateModal from './state-modal';
import { createSettlement } from '../../actions/settlements';
import { showSuccess } from '../../actions/errors';
import {
    TextField, Autocomplete, Button
} from '@mui/material';
import debounce from 'lodash/debounce';
import api from '../../api-singleton';

SettlementModal.propTypes = {
    open          : PropTypes.bool.isRequired,
    handleClose   : PropTypes.func.isRequired,
    handleConfirm : PropTypes.func
};

export default function SettlementModal ({ open, handleClose, handleConfirm }) {
    const [ settlementName, setSettlementName ] = useState('');
    const [ states, setStates ] = useState([]);
    const [ selectedState, setSelectedState ] = useState(null);
    const [ search, setSearch ] = useState('');
    const dispatch = useDispatch();

    const listDebounceStates = useMemo(
        () =>
            debounce((search, run) => {
                (async () => {
                    const { data } = await api.states.list({ search });

                    if (run) {
                        // let newOptions = [];

                        // if (search && selectedState) {
                        //     newOptions = [ selectedState ];
                        // }

                        // if (data) {
                        //     newOptions = [ ...newOptions, ...data ];
                        // }

                        setStates(data);
                    }
                })();
            }, 500),
        // we can't recalculate cause debounce won't work
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    const _handleConfirm = async () => {
        dispatch(createSettlement(
            {
                data: {
                    name    : settlementName,
                    stateId : selectedState.id
                }
            },
            () => {
                dispatch(showSuccess(`${settlementName} has been successfully created.`));
                handleClose();
            }
        ));
        handleConfirm?.();
    };

    useEffect(() => {
        let run = true;

        listDebounceStates(search, run);

        return () => {
            run = false;
        };
    }, [ listDebounceStates, search ]);

    const [ stateModalStatus, setStateModalStatus ] = useState(false);
    const changeStateModalStatus = () => setStateModalStatus(prev => !prev);

    return (
        <Modal
            handleClose={handleClose}
            handleConfirm={_handleConfirm}
            confirmButtonText="Create"
            open={open}
            title={'Create settlement'}
            fullWidth
        >
            <StateModal
                open={stateModalStatus}
                handleConfirm={state => { setStates([ state ]); setSelectedState(state); }}
                handleClose={changeStateModalStatus}
            />
            <TextField
                fullWidth
                autoComplete="new-password"
                id="coach-name-input"
                label="Name"
                value={settlementName}
                onChange={e => setSettlementName(e.target.value)}
                sx={{ mb: 1.5, mt: 1 }}
            />
            <Autocomplete
                includeInputInList
                blurOnSelect
                autoHighlight
                fullWidth
                options={states}
                // sx={{ mb: 1 }}
                value={selectedState}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                getOptionLabel={state => state.name || ''}
                renderInput={(params) => <TextField {...params} label="States" />}
                onChange={(e, option) => setSelectedState(option)}
                onInputChange={(event, newInputValue) => setSearch(newInputValue)}
            />
            <Button
                fullWidth
                onClick={changeStateModalStatus}
            >
                Create new state
            </Button>
        </Modal>
    );
}
