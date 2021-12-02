import api from '../api-singleton';
import * as reducer from '../reducers/coaches';

export function listCoaches (params = {}) {
    return async dispatch => {
        try {
            dispatch(reducer.listRequest());

            const data = await api.coaches.list(params);

            dispatch(reducer.list(data));
        } catch (errData) {
            dispatch(reducer.listRequestError(errData));
        }
    };
}

export function deleteCoach (id, onSuccess) {
    return async dispatch => {
        try {
            const { data } = await api.coaches.delete(id);

            dispatch(reducer.deleteCoach(data));
            onSuccess?.();
        } catch (errData) {
            dispatch(reducer.deleteRequestError(errData));
        }
    };
}

export function deleteError (field) {
    return reducer.deleteError(field);
}
