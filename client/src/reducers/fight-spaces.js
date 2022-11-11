import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  list: [],
  isLoading: false
};

const reducers = createSlice({
  name: 'fightSpaces',
  initialState,
  reducers: {
    list: (state, action) => {
      state.list = action.payload;
      state.isLoading = false;
    },
    listRequest: (state) => {
      state.isLoading = true;
    },
    bulkUpdateRequest: (state) => {
      state.isLoading = true;
    },
    bulkUpdate: (state, action) => {
      state.list = action.payload;
      state.isLoading = false;
    }
  }
});

const { actions, reducer } = reducers;

export const { list, listRequest, bulkUpdateRequest, bulkUpdate } = actions;

export default reducer;
