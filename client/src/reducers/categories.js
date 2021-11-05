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
        clearList  : state => { state.list = []; state.listMeta = {}; },
        bulkDelete : (state, action) => {
            state.list = state.list.filter(({ id }) => !action.payload.includes(id));
            state.isLoading = false;
        },
        bulkDeleteRequest      : state => { state.isLoading = true; },
        bulkDeleteRequestError : (state, action) => {
            state.isLoading = false;
            state.errors = action.payload;
        }
    }
});

const { actions, reducer } = categories;

export const {
    list, listRequest, clearList, listRequestError,
    bulkDelete, bulkDeleteRequest, bulkDeleteRequestError
} = actions;

export default reducer;
