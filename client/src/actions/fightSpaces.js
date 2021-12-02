import api from '../api-singleton';
import * as reducer from '../reducers/fight-spaces';

export function list (competitionId) {
    return async dispatch => {
        try {
            dispatch(reducer.listRequest());

            const { data } = await api.fightSpaces.list({ competitionId });

            dispatch(reducer.list(data));
        } catch (err) {}
    };
}

// export function clearList () {
//     return reducer.clearList();
// }

// export function show (...args) {
//     return async dispatch => {
//         try {
//             dispatch(reducer.showRequest());

//             const { data } = await api.competitions.show(...args);

//             dispatch(reducer.show(data));
//         } catch (err) {}
//     };
// }

export function bulkUpdate (id, payload, onSuccess) {
    return async dispatch => {
        try {
            dispatch(reducer.bulkUpdateRequest());

            const { data } = await api.fightSpaces.bulkUpdate(id, payload);

            dispatch(reducer.bulkUpdate(data));

            onSuccess?.();
        } catch (err) {}
    };
}

// export function getActive (...args) {
//     return async dispatch => {
//         try {
//             dispatch(reducer.showRequest());

//             const { data } = await api.competitions.show(...args);

//             dispatch(reducer.setActive(data));
//         } catch (err) {}
//     };
// }
