import api from 'api-singleton';
import * as reducer from 'reducers/settlements';

export function listSettlements(params = {}) {
  return async (dispatch) => {
    try {
      dispatch(reducer.listRequest());

      const data = await api.settlements.list(params);

      dispatch(reducer.list(data));
    } catch (errData) {
      dispatch(reducer.listRequestError(errData));
    }
  };
}

export function createSettlement(settlement, onSuccess) {
  return async (dispatch) => {
    try {
      dispatch(reducer.createRequest());

      const { data } = await api.settlements.create(settlement);

      dispatch(reducer.create(data));
      onSuccess?.();
    } catch (errData) {
      dispatch(reducer.createRequestError(errData));
    }
  };
}

// export function deleteSettlement (id, onSuccess) {
//     return async dispatch => {
//         try {
//             const { data } = await api.settlements.delete(id);

//             dispatch(reducer.deleteSettlement(data));
//             onSuccess?.();
//         } catch (errData) {
//             dispatch(reducer.deleteRequestError(errData));
//         }
//     };
// }

export function deleteError(field) {
  return reducer.deleteError(field);
}
