import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

//fetch accounts
const apiUrl = import.meta.env.VITE_BASE_URL;

const API_ENDPOINT = `${apiUrl}/api`;

// Thunk to fetch account from the API
export const fetchUserTransactions = createAsyncThunk(
  "transaction/fetchUserTransactions",
  async (accountNumber) => {
    const response = await axios.get(
      `${API_ENDPOINT}/bankone/getUserTransactions/${accountNumber}`
    );

    return response.data;
  }
);

// customer slice
const transactionsSlice = createSlice({
  name: "customers",
  initialState: {
    userTransactions: null,
    status: "idle",
    error: null,
  },
  reducers: {
    updateTransactionState: (state, action) => {
      state[action.payload.name] = action.payload.value;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(fetchUserTransactions.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserTransactions.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.userTransactions = action.payload;
      })
      .addCase(fetchUserTransactions.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { updateTransactionState } = transactionsSlice.actions;

export default transactionsSlice.reducer;
