import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  list: [],
  listMeta: {},
  errors: {},
  isLoading: false
};

const fights = createSlice({
  name: 'fights',
  initialState,
  reducers: {
    listRequest: (state) => {
      state.isLoading = true;
    },
    list: (state, action) => {
      state.list = action.payload.data;
      state.listMeta = action.payload.meta;
      state.isLoading = false;
    },
    concatToList: (state, action) => {
      state.list = state.list.concat(action.payload.data);
      state.listMeta = action.payload.meta;
      state.isLoading = false;
    },
    listRequestError: (state, action) => {
      state.isLoading = false;
      state.errors = action.payload;
    },
    shiftRequestError: (state, action) => {
      state.isLoading = false;
      state.errors = action.payload;
    },
    addList: (state, action) => {
      state.list = state.list.concat(action.payload.data);
      state.listMeta = action.payload.meta;
      state.isLoading = false;
    },
    clearList: (state) => {
      state.list = [];
      state.listMeta = {};
    },

    update: (state, action) => {
      const fighterIndex = state.list.findIndex((c) => c.id === action.payload.id);
      if (!fighterIndex) return;
      state.list[fighterIndex] = action.payload;
    },
    updateRequestError: (state, action) => {
      state.isLoading = false;
      state.errors = action.payload;
    }
  }
});

const { actions, reducer } = fights;

export const {
  list,
  concatToList,
  listRequest,
  clearList,
  listRequestError,
  addList,
  update,
  updateRequestError,
  shiftRequestError
} = actions;

export default reducer;
