const uuid = crypto.randomUUID.bind(crypto);

export const MESSAGE_ERROR   = 'MESSAGE_ERROR';
export const MESSAGE_SUCCESS = 'MESSAGE_SUCCESS';
export const MESSAGE_CLEAR   = 'MESSAGE_CLEAR';
export const MESSAGES_CLEAR  = 'MESSAGES_CLEAR';

export function showError (error = {}, autoclose = true) {
    return async dispatch => {
        const id = uuid();
        const item = typeof error === 'string'
            ? {
                id,
                message : error,
                refresh : !autoclose
            }
            : {
                ...error,
                id,
                message : error.message,
                refresh : !autoclose
            };

        dispatch({ type: MESSAGE_ERROR, payload: item });
    };
}

export function showSuccess (message, autoclose = true) {
    return async dispatch => {
        const id = uuid();
        dispatch({ type: MESSAGE_SUCCESS, payload: { id, message, refresh: false } });
    };
}

export function removeMessage (id) {
    return { type: MESSAGE_CLEAR, payload: { id } };
}

export function removeMessages (params) {
    return { type: MESSAGES_CLEAR, payload: { params } };
}
