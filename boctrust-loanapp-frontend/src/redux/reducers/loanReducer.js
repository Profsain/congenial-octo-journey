import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

//fetch accounts
const apiUrl = import.meta.env.VITE_BASE_URL;

const API_ENDPOINT = `${apiUrl}/api`;

// Thunk to fetch account from the API
export const fetchAllLoans = createAsyncThunk(
  "account/fetchAllLoans",
  async () => {
    const response = await axios.get(`${API_ENDPOINT}/loans`);

    return response.data;
  }
);

// Thunk to fetch account from the API
export const fetchPendingLoans = createAsyncThunk(
  "account/fetchPendingLoans",
  async () => {
    const response = await axios.get(`${API_ENDPOINT}/loans/pending`);

    return response.data;
  }
);

// Thunk to fetch account from the API
export const fetchUnbookedOrBookedLoans = createAsyncThunk(
  "account/fetchUnbookedOrBookedLoans",
  async () => {
    const response = await axios.get(
      `${API_ENDPOINT}/loans/booked-or-unbooked`
    );

    return response.data;
  }
);

// Thunk to fetch account from the API
export const fetchBookedOrDisbursedLoans = createAsyncThunk(
  "account/fetchBookedOrDisbursedLoans",
  async () => {
    const response = await axios.get(
      `${API_ENDPOINT}/loans/booked-or-disbursed`
    );

    return response.data;
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



// Thunk to fetch account from the API
export const bookLoan = createAsyncThunk(
  "account/bookLoans",
  async (loanId, thunkAPI) => {
    try {
      await axios.put(`${apiUrl}/api/loans/book/${loanId}`);
     
    } catch (error) {
      if (error instanceof AxiosError) {
        return thunkAPI.rejectWithValue(error.response?.data?.message);
      }
      return thunkAPI.rejectWithValue("Could not Book Loan");
    }
  }
);
// Thunk to fetch account from the API
export const approveBookedLoan = createAsyncThunk(
  "account/approveBookedLoan",
  async (loanId, thunkAPI) => {
    try {
      await axios.put(`${apiUrl}/api/loans/approved-book/${loanId}`);
    
    } catch (error) {
      if (error instanceof AxiosError) {
        return thunkAPI.rejectWithValue(error.response?.data?.message);
      }
      return thunkAPI.rejectWithValue("Could Approve and Create Account");
    }
  }
);

export const disburseLoan = createAsyncThunk(
  "account/disburseLoan",
  async (loanId, thunkAPI) => {
    try {
      await axios.put(`${apiUrl}/api/loans/disburse/${loanId}`);
    } catch (error) {
      if (error instanceof AxiosError) {
        return thunkAPI.rejectWithValue(error.response?.data?.message);
      }
      return thunkAPI.rejectWithValue("Could Approve and Create Account");
    }
  }
);

export const approveDisburseLoan = createAsyncThunk(
  "account/approveDisburseLoan",
  async (loanId, thunkAPI) => {
    try {
      await axios.put(`${apiUrl}/api/loans/approve-disburse/${loanId}`);
    } catch (error) {
      if (error instanceof AxiosError) {
        return thunkAPI.rejectWithValue(error.response?.data?.message);
      }
      return thunkAPI.rejectWithValue("Could Approve and Create Account");
    }
  }
);

// customer slice
const loanSlice = createSlice({
  name: "customers",
  initialState: {
    allLoans: null,
    pendingLoans: null,
    unbookedBookedLoans: null,
    bookedDisbursedLoans: null,
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
      .addCase(fetchUnbookedOrBookedLoans.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUnbookedOrBookedLoans.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.unbookedBookedLoans = action.payload;
      })
      .addCase(fetchUnbookedOrBookedLoans.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchBookedOrDisbursedLoans.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchBookedOrDisbursedLoans.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.bookedDisbursedLoans = action.payload;
      })
      .addCase(fetchBookedOrDisbursedLoans.rejected, (state, action) => {
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
