import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    list      : [],
    listMeta  : {},
    errors    : {},
    isLoading : false
};

const fighters = createSlice({
    name     : 'fighters',
    initialState,
    reducers : {
        deleteError: (state, action) => {
            delete state.errors[action.payload];
        },
        listRequest : (state) => { state.isLoading = false; },
        list        : (state, action) => {
            state.list = action.payload.data;
            state.listMeta = action.payload.meta;
            state.isLoading = false;
        },
        listRequestError: (state, action) => {
            state.isLoading = false;
            state.errors = action.payload;
        },
        addList: (state, action) => {
            state.list = state.list.concat(action.payload.data);
            state.listMeta = action.payload.meta;
            state.isLoading = false;
        },
        clearList: state => { state.list = []; state.listMeta = {}; },

        create: (state, action) => {
            state.list.push(action.payload);
            state.isLoading = false;
        },
        createRequestError: (state, action) => {
            state.isLoading = false;
            state.errors = action.payload;
        },

        deleteFighter: (state, action) => {
            state.list = state.list.filter(({ id }) => action.payload.id !== id);
        },
        deleteRequestError: (state, action) => {
            state.errors = action.payload;
        },

        update: (state, action) => {
            const fighterIndex = state.list.findIndex(c => c.id === action.payload.id);
            if (!fighterIndex) return;
            state.list[fighterIndex] = action.payload;
        },
        updateRequestError: (state, action) => {
            state.isLoading = false;
            state.errors = action.payload;
        }
    }
});

const { actions, reducer } = fighters;

export const {
    deleteError,
    list, listRequest, clearList, listRequestError, addList,
    create, createRequest, createRequestError,
    deleteFighter, deleteRequest, deleteRequestError,
    update, updateRequestError
} = actions;

export default reducer;
