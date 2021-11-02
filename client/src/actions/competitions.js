import api            from '../api-singleton';
import * as reducer   from '../reducers/competitions';

export function list (...args) {
    return async dispatch => {
        try {
            dispatch(reducer.listRequest());

            const data = await api.competitions.list(...args);

            dispatch(reducer.list(data));
        } catch (err) {}
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
        } catch (err) {}
    };
}

export function getActive (...args) {
    return async dispatch => {
        try {
            dispatch(reducer.listRequest());

            const { data } = await api.competitions.show(...args);

            dispatch(reducer.setActive(data));
        } catch (err) {}
    };
}
