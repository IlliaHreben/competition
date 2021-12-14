import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    list      : [],
    listMeta  : {},
    errors    : {},
    isLoading : false
};

const settlements = createSlice({
    name     : 'settlements',
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

        deleteSettlement: (state, action) => {
            state.list = state.list.filter(({ id }) => action.payload.id !== id);
        },
        deleteRequestError: (state, action) => {
            state.errors = action.payload;
        }
    }
});

const { actions, reducer } = settlements;

export const {
    deleteError,
    list, listRequest, clearList, listRequestError,
    create, createRequest, createRequestError,
    deleteSettlement, deleteRequest, deleteRequestError
} = actions;

export default reducer;
