import api from 'api-singleton';
import * as reducer from 'reducers/sections';
import * as categoryReducer from 'reducers/categories';

export function list(params = {}) {
  return async (dispatch) => {
    try {
      dispatch(reducer.listRequest());

      const data = await api.sections.list(params);

      dispatch(reducer.list(data));
    } catch (errData) {
      dispatch(reducer.listRequestError(errData));
    }
  };
}

export function deleteSection(id, onSuccess) {
  return async (dispatch) => {
    try {
      const { data } = await api.sections.delete(id);

      dispatch(reducer.deleteSection(data));
      onSuccess?.();
    } catch (errData) {
      dispatch(reducer.deleteRequestError(errData));
    }
  };
}

export function createSection(section, categories) {
  return async (dispatch) => {
    try {
      dispatch(reducer.createRequest());

      const { data } = await api.sections.create(section);
      const { data: categoriesList } = await api.categories.bulkCreate({
        sectionId: data.id,
        data: categories
      });

      dispatch(reducer.create(data));
      dispatch(categoryReducer.bulkCreate(categoriesList));
    } catch (errData) {
      dispatch(reducer.createRequestError(errData));
    }
  };
}

export function deleteError(field) {
  return reducer.deleteError(field);
}
