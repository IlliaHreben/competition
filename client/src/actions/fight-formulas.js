import api from '../api-singleton';
import * as reducer from '../reducers/fight-formulas';

export function listFightFormulas(...args) {
  return async (dispatch) => {
    try {
      dispatch(reducer.listRequest());

      const data = await api.fightFormulas.list(...args);

      dispatch(reducer.list(data));
    } catch (errData) {
      dispatch(reducer.listRequestError(errData));
    }
  };
}

export function clearListFightFormulas() {
  return reducer.clearList();
}

// export function showFightFormula(...args) {
//   return async (dispatch) => {
//     try {
//       dispatch(reducer.showRequest());

//       const { data } = await api.fightFormulas.show(...args);

//       dispatch(reducer.show(data));
//     } catch (errData) {
//       dispatch(reducer.showRequestError(errData));
//     }
//   };
// }

export function updateFightFormula(id, payload, onSuccess) {
  return async (dispatch) => {
    try {
      dispatch(reducer.updateRequest());

      const { data } = await api.fightFormulas.update(id, payload);

      dispatch(reducer.update(data));

      onSuccess?.();
    } catch (errData) {
      dispatch(reducer.updateRequestError(errData));
    }
  };
}

export function createFightFormula(id, payload, onSuccess) {
  return async (dispatch) => {
    try {
      dispatch(reducer.createRequest());

      const { data } = await api.fightFormulas.create(id, payload);

      dispatch(reducer.create(data));

      onSuccess?.();
    } catch (errData) {
      dispatch(reducer.createRequestError(errData));
    }
  };
}

export function deleteFightFormula(id, onSuccess) {
  return async (dispatch) => {
    try {
      dispatch(reducer.deleteRequest());

      const { data } = await api.fightFormulas.delete(id);

      dispatch(reducer.deleteItem(data));

      onSuccess?.();
    } catch (errData) {
      dispatch(reducer.deleteRequestError(errData));
    }
  };
}
