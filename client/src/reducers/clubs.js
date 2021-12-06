import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    list      : [],
    listMeta  : {},
    errors    : {},
    isLoading : false
};

const clubs = createSlice({
    name     : 'clubs',
    initialState,
    reducers : {
        deleteError: (state, action) => {
            delete state.errors[action.payload];
        },
        list: (state, action) => {
            state.list = action.payload.data;
            state.listMeta = action.payload.meta;
            state.isLoading = false;
        },
        listRequest      : state => { state.isLoading = true; },
        listRequestError : (state, action) => {
            state.isLoading = false;
            state.errors = action.payload;
        },
        clearList: state => { state.list = []; state.listMeta = {}; },

        create: (state, action) => {
            state.list.push(action.payload);
            state.isLoading = false;
        },
        createRequest      : state => { state.isLoading = true; },
        createRequestError : (state, action) => {
            state.isLoading = false;
            state.errors = action.payload;
        },

        updateRequest : state => { state.isLoading = true; },
        updateClub    : (state, action) => {
            const index = state.list.findIndex(c => c.id === action.payload.id);
            if (!index) return;
            state.list[index] = action.payload;
        },
        updateRequestError: (state, action) => {
            state.isLoading = false;
            state.errors = action.payload;
        },

        deleteClub: (state, action) => {
            state.list = state.list.filter(({ id }) => action.payload.id !== id);
        },
        deleteRequestError: (state, action) => {
            state.errors = action.payload;
        }
    }
});

const { actions, reducer } = clubs;

export const {
    deleteError,
    list, listRequest, clearList, listRequestError,
    create, createRequest, createRequestError,
    deleteClub, deleteRequest, deleteRequestError,
    updateRequest, updateRequestError, updateClub
} = actions;

export default reducer;
