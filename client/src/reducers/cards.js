import { createSlice } from '@reduxjs/toolkit';
import * as fightersReducer from './fighters';
import * as clubsReducer from './clubs';
import * as coachesReducer from './coaches';

const initialState = {
  list: [],
  listMeta: {},
  errors: {},
  isLoading: false
};

const cards = createSlice({
  name: 'cards',
  initialState,
  reducers: {
    deleteError: (state, action) => {
      delete state.errors[action.payload];
    },
    listRequest: (state) => {
      state.isLoading = false;
    },
    list: (state, action) => {
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
    clearList: (state) => {
      state.list = [];
      state.listMeta = {};
    },

    create: (state, action) => {
      state.list.push(action.payload);
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
    },

    update: (state, action) => {
      const cardIndex = state.list.findIndex((c) => c.id === action.payload.id);

      if (cardIndex === -1) return;
      state.list[cardIndex] = action.payload;
    },
    updateRequestError: (state, action) => {
      state.isLoading = false;
      state.errors = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fightersReducer.update, (state, action) => {
        state.list.forEach((card, i) => {
          if (card.linked?.fighter?.id !== action.payload.id) return;
          state.list[i].linked.fighter = action.payload;
        });
      })
      .addCase(coachesReducer.updateCoach, (state, action) => {
        const updatedInfo = {
          name: action.payload.name,
          lastName: action.payload.lastName
        };

        state.list.forEach((card, i) => {
          if (card.linked?.coach?.id !== action.payload.id) return;
          state.list[i].linked.coach = {
            ...state.list[i].linked.coach,
            ...updatedInfo
          };
        });
      })
      .addCase(clubsReducer.updateClub, (state, action) => {
        state.list.forEach((card, i) => {
          if (card.linked?.club?.id !== action.payload.id) return;
          state.list[i].linked.club = {
            ...state.list[i].linked.club,
            name: action.payload.name,
            linked: {
              ...state.list[i].linked.club.linked,
              settlement: action.payload.linked.settlement
            }
          };
        });
      });
  }
});

const { actions, reducer } = cards;

export const {
  deleteError,
  list,
  listRequest,
  clearList,
  listRequestError,
  addList,
  create,
  createRequest,
  createRequestError,
  deleteCard,
  deleteRequest,
  deleteRequestError,
  update,
  updateRequestError
} = actions;

export default reducer;
