import api            from '../api-singleton';
import * as reducer   from '../reducers/competitions';

export function list (...args) {
    return async dispatch => {
        try {
            dispatch(reducer.listRequest());

            const data = await api.competitions.list(...args);

            dispatch(reducer.list(data));
        } catch (errData) {
            dispatch(reducer.listRequestError(errData));
        }
    };
}

export function clearList () {
    return reducer.clearList();
}

export function show (...args) {
    return async dispatch => {
        try {
            dispatch(reducer.showRequest());

            const { data } = await api.competitions.show(...args);

            dispatch(reducer.show(data));
        } catch (errData) {
            dispatch(reducer.showRequestError(errData));
        }
    };
}

export function update (id, payload, onSuccess) {
    return async dispatch => {
        try {
            dispatch(reducer.updateRequest());

            const { data } = await api.competitions.update(id, payload);

            dispatch(reducer.updateCompetition(data));

            onSuccess?.();
        } catch (errData) {
            dispatch(reducer.updateRequestError(errData));
        }
    };
}

export function getActive (...args) {
    return async dispatch => {
        try {
            dispatch(reducer.showRequest());

            const { data } = await api.competitions.show(...args);

            dispatch(reducer.setActive(data));
        } catch (err) {}
    };
}
