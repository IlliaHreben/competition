import * as reducer from '../reducers/errors';

const uuid = crypto.randomUUID.bind(crypto);

export function showError(error = {}, autoclose = true) {
  return async (dispatch) => {
    const id = uuid();
    const item =
      typeof error === 'string'
        ? {
            id,
            message: error,
            refresh: !autoclose
          }
        : {
            ...error,
            id,
            message: error.message,
            refresh: !autoclose
          };

    dispatch(reducer.showError(item));
  };
}

export function showSuccess(message) {
  return async (dispatch) => {
    const id = uuid();
    dispatch(reducer.showSuccess({ id, message }));
  };
}

export function removeMessage(id) {
  return reducer.removeMessage({ id });
}

export function removeMessages(params) {
  return reducer.removeMessages({ params });
}
