import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

//fetch employer
const apiUrl = import.meta.env.VITE_BASE_URL;
const API_ENDPOINT = `${apiUrl}/api/mandate-rule`;

// Thunk to fetch employer from the API
export const fetchMandateRules = createAsyncThunk(
  "mandateRule/fetchMandateRules",
  async () => {
    const response = await axios.get(API_ENDPOINT);
    console.log(response.data.mandateRules)
    return response.data.mandateRules;
  }
);

// employer slice
const mandateRuleSlice = createSlice({
  name: "mandateRule",
  initialState: {
    mandateRules: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMandateRules.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMandateRules.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.mandateRules = action.payload;
      })
      .addCase(fetchMandateRules.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default mandateRuleSlice.reducer;
