import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    list      : [],
    listMeta  : {},
    errors    : {},
    isLoading : false
};

const cards = createSlice({
    name     : 'cards',
    initialState,
    reducers : {
        deleteError: (state, action) => {
            delete state.errors[action.payload];
        },
        listRequest : (state) => { state.isLoading = false; },
        list        : (state, action) => {
            state.list = state.list.concat(action.payload.data);
            state.listMeta = action.payload.meta;
            state.isLoading = false;
        },
        listRequestError: (state, action) => {
            state.isLoading = false;
            state.errors = action.payload;
        },
        clearList: state => { state.list = []; state.listMeta = {}; },

        create: (state, action) => {
            state.list.push(...action.payload);
            state.isLoading = false;
        },
        createRequestError: (state, action) => {
            state.isLoading = false;
            state.errors = action.payload;
        },

        deleteCard: (state, action) => {
            state.list = state.list.filter(({ id }) => action.payload.id !== id);
        },
        deleteRequestError: (state, action) => {
            state.errors = action.payload;
        }
    }
});

const { actions, reducer } = cards;

export const {
    deleteError,
    list, listRequest, clearList, listRequestError,
    create, createRequest, createRequestError,
    deleteCard, deleteRequest, deleteRequestError
} = actions;

export default reducer;
