import api            from '../api-singleton';
import COMPETITIONS   from '../constants/competitions';

export function list (...args) {
    return async dispatch => {
        try {
            dispatch({
                type: COMPETITIONS.GET_COMPETITIONS_LIST_REQUEST
            });

            const list = await api.competitions.list(...args);

            dispatch({
                type    : COMPETITIONS.GET_COMPETITIONS_LIST_SUCCESS,
                payload : list
            });
        } catch (err) {
            dispatch({
                type: COMPETITIONS.GET_COMPETITIONS_LIST_ERROR
            });
        }
    };
}

export function show (...args) {
    return async dispatch => {
        try {
            dispatch({
                type: COMPETITIONS.GET_ACTIVE_COMPETITION_REQUEST
            });

            const { data } = await api.competitions.show(...args);

            dispatch({
                type    : COMPETITIONS.GET_ACTIVE_COMPETITION_SUCCESS,
                payload : data
            });
        } catch (err) {
            dispatch({
                type: COMPETITIONS.GET_ACTIVE_COMPETITION_ERROR
            });
        }
    };
}
