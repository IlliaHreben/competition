import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  list: []
};

const errors = createSlice({
  name: 'errors',
  initialState,
  reducers: {
    showError: (state, action) => {
      state.list.push({ ...action.payload, type: 'error' });
    },
    showSuccess: (state, action) => {
      state.list.push({ ...action.payload, type: 'success' });
    },
    removeMessage: (state, action) => {
      state.list = state.list.filter((item) => item.id !== action.payload.id);
    },
    removeMessages: (state, action) => {
      const { params } = action.payload;

      state.list = state.list.filter(
        (item) => !Object.keys(params).every((key) => item[key] === params[key])
      );
    }
  }
});

const { actions, reducer } = errors;

export const { showError, showSuccess, removeMessage, removeMessages } = actions;

export default reducer;
