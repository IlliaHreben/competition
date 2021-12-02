import api from '../api-singleton';
import * as reducer from '../reducers/cards';

export function listCards (params = {}) {
    return async dispatch => {
        try {
            dispatch(reducer.listRequest());

            const data = await api.cards.list(params);

            dispatch(reducer.list(data));
        } catch (errData) {
            dispatch(reducer.listRequestError(errData));
        }
    };
}

export function supplementListCards (params = {}) {
    return async dispatch => {
        try {
            dispatch(reducer.listRequest());

            const data = await api.cards.list(params);

            dispatch(reducer.addList(data));
        } catch (errData) {
            dispatch(reducer.listRequestError(errData));
        }
    };
}

export function deleteCard (id, onSuccess) {
    return async dispatch => {
        try {
            const { data } = await api.cards.delete(id);

            dispatch(reducer.deleteCard(data));
            onSuccess?.();
        } catch (errData) {
            dispatch(reducer.deleteRequestError(errData));
        }
    };
}

export function createCard (section, categories) {
    return async dispatch => {
        try {
            const { data } = await api.cards.create(section);

            dispatch(reducer.create(data));
        } catch (errData) {
            dispatch(reducer.createRequestError(errData));
        }
    };
}

export function updateCard (id, section, onSuccess) {
    return async dispatch => {
        try {
            await api.cards.update(id, section);
            const { data } = await api.cards.show(id, { include: [ 'category', 'coach', 'club', 'fighter' ] });

            dispatch(reducer.update(data));

            onSuccess?.();
        } catch (errData) {
            dispatch(reducer.updateRequestError(errData));
        }
    };
}

export function deleteError (field) {
    return reducer.deleteError(field);
}
