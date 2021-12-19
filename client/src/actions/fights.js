import api from '../api-singleton';
import * as categoriesReducer from '../reducers/categories';

// export function listFighters (params = {}) {
//     return async dispatch => {
//         try {
//             dispatch(reducer.listRequest());

//             const data = await api.fighters.list(params);

//             dispatch(reducer.list(data));
//         } catch (errData) {
//             dispatch(reducer.listRequestError(errData));
//         }
//     };
// }

// export function supplementListFighters (params = {}) {
//     return async dispatch => {
//         try {
//             dispatch(reducer.listRequest());

//             const data = await api.fighters.list(params);

//             dispatch(reducer.addList(data));
//         } catch (errData) {
//             dispatch(reducer.listRequestError(errData));
//         }
//     };
// }

// export function deleteFighter (id, onSuccess) {
//     return async dispatch => {
//         try {
//             const { data } = await api.fighters.delete(id);

//             dispatch(reducer.deleteFighter(data));
//             onSuccess?.();
//         } catch (errData) {
//             dispatch(reducer.deleteRequestError(errData));
//         }
//     };
// }

export function setWinner (data, onSuccess) {
    return async dispatch => {
        try {
            const { data: fight } = await api.fights.setWinner(data);
            const { data: category } = await api.categories.show(fight.categoryId, { include: [ 'cards', 'sections' ] });
            dispatch(categoriesReducer.show(category));

            onSuccess?.();
        } catch (errData) {
            // dispatch(reducer.createRequestError(errData));
        }
    };
}

// export function updateFighter (id, recalculate, competitionId, fighter, onSuccess) {
//     return async dispatch => {
//         try {
//             await api.fighters.update(id, recalculate, competitionId, fighter);
//             const { data } = await api.fighters.show(id, { include: [ 'coach', 'club' ] });

//             dispatch(reducer.update(data));

//             onSuccess?.();
//         } catch (errData) {
//             dispatch(reducer.updateRequestError(errData));
//         }
//     };
// }

// export function deleteError (field) {
//     return reducer.deleteError(field);
// }
