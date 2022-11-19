import api from '../api-singleton';
import * as reducer from '../reducers/fight-formulas';

export function list(...args) {
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

export function clearList() {
  return reducer.clearList();
}

export function clearShow() {
  return reducer.clearShow();
}

export function show(...args) {
  return async (dispatch) => {
    try {
      dispatch(reducer.showRequest());

      const { data } = await api.fightFormulas.show(...args);

      dispatch(reducer.show(data));
    } catch (errData) {
      dispatch(reducer.showRequestError(errData));
    }
  };
}

export function update(id, payload, onSuccess) {
  return async (dispatch) => {
    try {
      dispatch(reducer.updateRequest());

      const { data } = await api.fightFormulas.update(id, payload);

      dispatch(reducer.updateFightFormula(data));

      onSuccess?.();
    } catch (errData) {
      dispatch(reducer.updateRequestError(errData));
    }
  };
}

export function getActive(...args) {
  return async (dispatch) => {
    try {
      dispatch(reducer.showRequest());

      const { data } = await api.fightFormulas.show(...args);

      dispatch(reducer.setActive(data));
    } catch (err) {}
  };
}

export function activateFightFormula(id, onSuccess) {
  return async (dispatch, getState) => {
    const competition = getState().fightFormulas.list.find((c) => c.id === id);
    dispatch(reducer.setActive(competition));

    onSuccess?.();
  };
}

export function deleteFightFormula(id, onSuccess) {
  return async (dispatch) => {
    try {
      dispatch(reducer.deleteRequest());

      const { data } = await api.fightFormulas.delete(id);

      dispatch(reducer.deleteFightFormula(data));

      onSuccess?.();
    } catch (errData) {
      dispatch(reducer.deleteRequestError(errData));
    }
  };
}
