import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
  },
  reducers: {
    loginUser: (state, action) => {
      state.user = action.payload.user || action.payload.customer;
      // state.token = action.payload.user.token || action.payload.customer.token;
    },
    logoutUser: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});

export const { loginUser, logoutUser } = authSlice.actions;
export default authSlice.reducer;