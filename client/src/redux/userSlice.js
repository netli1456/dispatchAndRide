import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'userInfo',

  initialState: {
    userInfo: {},
    loading: false,
    error: null,
  },
  reducers: {
    fetchSuccess: (state, action) => {
      state.userInfo = action.payload;
    },

    clearUserInfo: (state) => {
      state.userInfo = {};
    },
  },
});

export const { fetchFail, fetchStart, fetchSuccess, clearUserInfo } = userSlice.actions;

export default userSlice.reducer;
