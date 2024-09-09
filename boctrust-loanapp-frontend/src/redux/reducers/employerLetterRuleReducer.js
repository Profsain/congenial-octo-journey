import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

//fetch employer
const apiUrl = import.meta.env.VITE_BASE_URL;
const API_ENDPOINT = `${apiUrl}/api/employer-letter-rule`;

// Thunk to fetch employer from the API
export const fetchEmployerLetterRules = createAsyncThunk(
  "employerLetterRule/fetchEmployerLetterRules",
  async () => {
    const response = await axios.get(API_ENDPOINT);

    return response.data.employerLetterRules;
  }
);

// employer slice
const employerLetterRuleReducer = createSlice({
  name: "employerLetterRule",
  initialState: {
    employerLetterRules: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployerLetterRules.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchEmployerLetterRules.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.employerLetterRules = action.payload;
      })
      .addCase(fetchEmployerLetterRules.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default employerLetterRuleReducer.reducer;
