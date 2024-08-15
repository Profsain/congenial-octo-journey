import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

//fetch accounts
const apiUrl = import.meta.env.VITE_BASE_URL;

const API_ENDPOINT = `${apiUrl}/api`;

// Thunk to fetch Loans from the API
export const fetchLoans = createAsyncThunk("account/fetchLoans", async () => {
  const response = await axios.get(`${API_ENDPOINT}/loans`);

  return response.data;
});

// Thunk to fetch All Loans from the API
export const fetchAllLoans = createAsyncThunk(
  "account/fetchAllLoans",
  async () => {
    const response = await axios.get(`${API_ENDPOINT}/loans/all`);

    return response.data;
  }
);

// Thunk to fetch Pending Loans from the API
export const fetchPendingLoans = createAsyncThunk(
  "account/fetchPendingLoans",
  async () => {
    const response = await axios.get(`${API_ENDPOINT}/loans/pending`);

    return response.data;
  }
);

// Thunk to fetch Unbooked Loans from the API
export const fetchUnbookedLoans = createAsyncThunk(
  "account/fetchUnbookedLoans",
  async () => {
    const response = await axios.get(`${API_ENDPOINT}/loans/unbooked`);

    return response.data;
  }
);

// Thunk to fetch account from the API
export const fetchBookedLoans = createAsyncThunk(
  "account/fetchBookedLoans",
  async () => {
    const res = await axios.get(`${API_ENDPOINT}/loans/booked`);

    return res.data;
  }
);
// Thunk to fetch account from the API
export const fetchCompletedLoan = createAsyncThunk(
  "account/fetchCompletedLoan",
  async () => {
    const res = await axios.get(`${API_ENDPOINT}/loans/disbursed`);

    return res.data;
  }
);

// Thunk to fetch account from the API
export const fetchCustomerLoans = createAsyncThunk(
  "account/fetchCustomerLoans",
  async (customerId) => {
    const response = await axios.get(`${API_ENDPOINT}/loans/${customerId}`);

    return response.data;
  }
);

// customer slice
const loanSlice = createSlice({
  name: "customers",
  initialState: {
    allLoans: null,
    pendingLoans: null,
    unbookedLoans: null,
    bookedLoans: null,
    completedLoans: null,
    selectedCustomerLoan: null,
    loanFirstInfo: null,
    status: "idle",
    error: null,
  },
  reducers: {
    updateLoanStateValues: (state, action) => {
      state[action.payload.name] = action.payload.value;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLoans.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchLoans.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.allLoans = action.payload;
      })
      .addCase(fetchLoans.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchAllLoans.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllLoans.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.allLoans = action.payload;
      })
      .addCase(fetchAllLoans.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchPendingLoans.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPendingLoans.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.pendingLoans = action.payload;
      })
      .addCase(fetchPendingLoans.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchUnbookedLoans.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUnbookedLoans.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.unbookedLoans = action.payload;
      })
      .addCase(fetchUnbookedLoans.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchBookedLoans.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchBookedLoans.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.bookedLoans = action.payload;
      })
      .addCase(fetchBookedLoans.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchCompletedLoan.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCompletedLoan.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.completedLoans = action.payload;
      })
      .addCase(fetchCompletedLoan.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchCustomerLoans.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCustomerLoans.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.selectedCustomerLoan = action.payload;
      })
      .addCase(fetchCustomerLoans.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { updateLoanStateValues } = loanSlice.actions;

export default loanSlice.reducer;
