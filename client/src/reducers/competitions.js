import produce from 'immer';
import C       from '../constants/competitions.js';

const initialState = {
    list      : [],
    active    : null,
    isLoading : false
};

export default function competitions (state = initialState, action) {
    const { type, payload } = action;

    return produce(state, draft => {
        switch (type) {
        case C.GET_COMPETITIONS_LIST_SUCCESS:
            draft.list = payload;
            draft.isLoading = false;
            break;
        case C.GET_COMPETITIONS_LIST_REQUEST:
            draft.isLoading = true;
            break;
        case C.GET_COMPETITIONS_LIST_ERROR:
            draft.isLoading = false;
            break;
        case C.GET_ACTIVE_COMPETITION_SUCCESS:
            draft.active = payload;
            draft.isLoading = false;
            break;
        case C.GET_ACTIVE_COMPETITION_ERROR:
            draft.active = null;
            draft.isLoading = false;
            break;
        case C.GET_ACTIVE_COMPETITION_REQUEST:
            draft.isLoading = true;
            break;
        default:
            return state;
        }
    });
}
