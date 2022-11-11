import api from '../api-singleton';
import * as reducer from '../reducers/states';

export function listStates(params = {}) {
  return async (dispatch) => {
    try {
      dispatch(reducer.listRequest());

      const data = await api.states.list(params);

      dispatch(reducer.list(data));
    } catch (errData) {
      dispatch(reducer.listRequestError(errData));
    }
  };
}

export function createState(settlement, onSuccess) {
  return async (dispatch) => {
    try {
      dispatch(reducer.createRequest());

      const { data } = await api.states.create(settlement);

      dispatch(reducer.create(data));
      onSuccess?.();
    } catch (errData) {
      dispatch(reducer.createRequestError(errData));
    }
  };
}

// export function deleteState (id, onSuccess) {
//     return async dispatch => {
//         try {
//             const { data } = await api.states.delete(id);

//             dispatch(reducer.deleteState(data));
//             onSuccess?.();
//         } catch (errData) {
//             dispatch(reducer.deleteRequestError(errData));
//         }
//     };
// }

export function deleteError(field) {
  return reducer.deleteError(field);
}
