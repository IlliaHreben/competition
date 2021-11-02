import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    list      : [],
    listMeta  : {},
    active    : null,
    current   : null,
    isLoading : false
};

const competitions = createSlice({
    name     : 'competitions',
    initialState,
    reducers : {
        list: (state, action) => {
            state.list = action.payload.data;
            state.listMeta = action.payload.meta;
            state.isLoading = false;
        },
        listRequest       : state => { state.isLoading = true; },
        clearList         : state => { state.list = []; state.listMeta = {}; },
        show              : (state, action) => { state.current = action.payload; },
        setActive         : (state, action) => { state.active = action.payload; },
        showRequest       : state => { state.isLoading = true; },
        updateRequest     : state => { state.isLoading = true; },
        updateCompetition : (state, action) => { state.current = action.payload; }
    }
});

const { actions, reducer } = competitions;

export const {
    list, listRequest, clearList,
    show, showRequest,
    setActive,
    updateRequest, updateCompetition
} = actions;

export default reducer;
