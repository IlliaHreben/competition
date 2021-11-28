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
