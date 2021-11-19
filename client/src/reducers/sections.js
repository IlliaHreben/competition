import { createSlice } from '@reduxjs/toolkit';
import * as categoriesReducer from './categories';

const initialState = {
    list      : [],
    listMeta  : {},
    errors    : {},
    isLoading : false
};

const sections = createSlice({
    name     : 'sections',
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
            state.list.push(...action.payload);
            state.isLoading = false;
        },
        createRequest      : state => { state.isLoading = true; },
        createRequestError : (state, action) => {
            state.isLoading = false;
            state.errors = action.payload;
        },

        deleteSection: (state, action) => {
            state.list = state.list.filter(({ id }) => action.payload.id !== id);
        },
        deleteRequestError: (state, action) => {
            state.errors = action.payload;
        }
    },
    extraReducers: {
        [categoriesReducer.bulkCreate]: (state, action) => {
            action.payload.forEach(category => {
                const sectionI = state.list.findIndex(s => s.id === category.sectionId);
                if (sectionI === -1) return;

                state.list[sectionI].linked.categories.push(category);
            });
        },
        [categoriesReducer.bulkDelete]: (state, action) => {
            action.payload.forEach(id => {
                for (const section of state.list) {
                    const categoryI = section.linked.categories.findIndex(c => c.id === id);
                    if (categoryI < 0) continue;

                    section.linked.categories.splice(categoryI, 1);
                    break;
                }
            });
        }
    }
});

const { actions, reducer } = sections;

export const {
    deleteError,
    list, listRequest, clearList, listRequestError,
    create, createRequest, createRequestError,
    deleteSection, deleteRequest, deleteRequestError
} = actions;

export default reducer;
