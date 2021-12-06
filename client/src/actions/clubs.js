import api from '../api-singleton';
import * as reducer from '../reducers/clubs';

export function listClubs (params = {}) {
    return async dispatch => {
        try {
            dispatch(reducer.listRequest());

            const data = await api.clubs.list(params);

            dispatch(reducer.list(data));
        } catch (errData) {
            dispatch(reducer.listRequestError(errData));
        }
    };
}

export function createClub (payload) {
    return async dispatch => {
        try {
            dispatch(reducer.createRequest());

            const data = await api.clubs.create(payload);

            dispatch(reducer.create(data));
        } catch (errData) {
            dispatch(reducer.createRequestError(errData));
        }
    };
}

export function updateClub (payload, onSuccess) {
    return async dispatch => {
        try {
            dispatch(reducer.updateRequest());

            const data = await api.clubs.update(payload);

            dispatch(reducer.updateClub(data));

            onSuccess?.();
        } catch (errData) {
            dispatch(reducer.createRequestError(errData));
        }
    };
}
