import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  list: [],
  listMeta: {},
  active: null,
  current: null,
  errors: {},
  isLoading: false
};

const fightFormulas = createSlice({
  name: 'fightFormulas',
  initialState,
  reducers: {
    list: (state, action) => {
      state.list = action.payload.data;
      state.listMeta = action.payload.meta;
      state.isLoading = false;
    },
    listRequest: (state) => {
      state.isLoading = true;
    },
    listRequestError: (state, action) => {
      state.isLoading = false;
      state.errors = action.payload;
    },
    clearList: (state) => {
      state.list = [];
      state.listMeta = {};
    },

    show: (state, action) => {
      state.current = action.payload;
    },
    setActive: (state, action) => {
      state.active = action.payload;
    },
    showRequest: (state) => {
      state.isLoading = true;
    },
    showRequestError: (state, action) => {
      state.isLoading = false;
      state.errors = action.payload;
    },
    clearShow: (state) => {
      state.current = initialState.current;
    },

    updateRequest: (state) => {
      state.isLoading = true;
    },
    updateFightFormula: (state, action) => {
      state.current = action.payload;
    },
    updateRequestError: (state, action) => {
      state.isLoading = false;
      state.errors = action.payload;
    },

    deleteRequest: (state) => {
      state.isLoading = true;
    },
    deleteFightFormula: (state, action) => {
      state.list = state.list.filter((c) => c.id !== action.payload.id);
    },
    deleteRequestError: (state, action) => {
      state.isLoading = false;
      state.errors = action.payload;
    }
  }
});

const { actions, reducer } = fightFormulas;

export const {
  list,
  listRequest,
  clearList,
  listRequestError,
  show,
  showRequest,
  showRequestError,
  clearShow,
  setActive,
  updateRequest,
  updateFightFormula,
  updateRequestError,
  deleteRequest,
  deleteFightFormula,
  deleteRequestError
} = actions;

export default reducer;
