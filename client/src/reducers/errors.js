import produce              from 'immer';
import {
    MESSAGE_ERROR,
    MESSAGE_SUCCESS,
    MESSAGE_CLEAR,
    MESSAGES_CLEAR
} from '../actions/errors.js';

const initialState = {
    list: []
};

export default function errors (state = initialState, action) {
    const { type, payload } = action;

    return produce(state, draft => {
        switch (type) {
        case MESSAGE_ERROR:
            draft.list.push({
                ...payload,
                type: 'error'
            });
            break;
        case MESSAGE_SUCCESS:
            draft.list.push({
                ...payload,
                type: 'success'
            });
            break;
        case MESSAGE_CLEAR:
            draft.list = draft.list.filter(item => item.id !== payload.id);
            break;
        case MESSAGES_CLEAR: {
            const { params } = payload;

            draft.list = draft.list.filter(item =>
                !Object.keys(params).every(key => item[key] === params[key])
            );
            break;
        }
        default:
            return state;
        }
    });
}
