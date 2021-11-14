import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    list      : [],
    listMeta  : {},
    errors    : {},
    isLoading : false
};

const categories = createSlice({
    name     : 'categories',
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

        bulkDelete: (state, action) => {
            state.list = state.list.filter(({ id }) => !action.payload.includes(id));
            state.isLoading = false;
        },
        bulkDeleteRequest      : state => { state.isLoading = true; },
        bulkDeleteRequestError : (state, action) => {
            state.isLoading = false;
            state.errors = action.payload;
        },

        bulkCreate: (state, action) => {
            state.list.push(...action.payload);
            state.isLoading = false;
        },
        bulkCreateRequest      : state => { state.isLoading = true; },
        bulkCreateRequestError : (state, action) => {
            state.isLoading = false;
            state.errors = action.payload;
        }
    }
});

const { actions, reducer } = categories;

export const {
    deleteError,
    list, listRequest, clearList, listRequestError,
    bulkDelete, bulkDeleteRequest, bulkDeleteRequestError,
    bulkCreate, bulkCreateRequest, bulkCreateRequestError
} = actions;

export default reducer;
