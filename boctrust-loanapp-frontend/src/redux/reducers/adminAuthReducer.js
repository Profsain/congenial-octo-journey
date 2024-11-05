import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: null,
    authLoading: false,
  },
  reducers: {
    loginUser: (state, action) => {
      state.user = action.payload.user || action.payload.customer;
      state.token = action.payload.user.token || action.payload.customer.token;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setAuthLoading: (state, action) => {
      state.authLoading = action.payload;
    },
    logoutUser: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});

export const { loginUser, logoutUser, setToken, setUser, setAuthLoading } =
  authSlice.actions;
export default authSlice.reducer;
