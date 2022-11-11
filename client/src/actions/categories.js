import api from '../api-singleton';
import * as reducer from '../reducers/categories';

export function listCategories(params) {
  return async (dispatch) => {
    try {
      dispatch(reducer.listRequest());

      const data = await api.categories.list(params);

      dispatch(reducer.list(data));
    } catch (errData) {
      dispatch(reducer.listRequestError(errData));
    }
  };
}

export function concatToListCategories(params) {
  return async (dispatch) => {
    try {
      const data = await api.categories.list(params);

      dispatch(reducer.concatToList(data));
    } catch (errData) {
      dispatch(reducer.listRequestError(errData));
    }
  };
}

export function deleteError(field) {
  return reducer.deleteError(field);
}

// export function clearList () {
//     return reducer.clearList();
// }

// export function show (...args) {
//     return async dispatch => {
//         try {
//             dispatch(reducer.showRequest());

//             const { data } = await api.categories.show(...args);

//             dispatch(reducer.show(data));
//         } catch (errData) {
//             dispatch(reducer.showRequestError(errData));
//         }
//     };
// }

export function bulkDelete(payload, onSuccess) {
  return async (dispatch) => {
    try {
      dispatch(reducer.bulkDeleteRequest());

      const { data } = await api.categories.bulkDelete({ data: payload });

      dispatch(reducer.bulkDelete(data));
      if (onSuccess) dispatch(onSuccess);
    } catch (errData) {
      dispatch(reducer.bulkDeleteRequestError(errData));
    }
  };
}

export function bulkCreate(payload, onSuccess) {
  return async (dispatch) => {
    try {
      dispatch(reducer.bulkCreateRequest());
      const { data } = await api.categories.bulkCreate(payload);
      dispatch(reducer.bulkCreate(data));

      onSuccess?.();
    } catch (errData) {
      dispatch(reducer.bulkCreateRequestError(errData));
    }
  };
}

// export function getActive (...args) {
//     return async dispatch => {
//         try {
//             dispatch(reducer.showRequest());

//             const { data } = await api.categories.show(...args);

//             dispatch(reducer.setActive(data));
//         } catch (err) {}
//     };
// }
