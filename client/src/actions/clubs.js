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

export function createClub (payload, onSuccess) {
    return async dispatch => {
        try {
            dispatch(reducer.createRequest());

            const { data } = await api.clubs.create(payload);

            dispatch(reducer.create(data));

            onSuccess?.();
        } catch (errData) {
            dispatch(reducer.createRequestError(errData));
        }
    };
}

export function updateClub (id, payload, onSuccess) {
    return async dispatch => {
        try {
            dispatch(reducer.updateRequest());

            await api.clubs.update(id, payload);
            const { data } = await api.clubs.show(id, { include: [ 'coaches', 'settlement' ] });

            dispatch(reducer.updateClub(data));

            onSuccess?.();
        } catch (errData) {
            dispatch(reducer.createRequestError(errData));
        }
    };
}
