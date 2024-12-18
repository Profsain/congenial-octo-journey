import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../lib/axios";

// Thunk to fetch Loans from the API
export const fetchMyLoans = createAsyncThunk(
  "account/fetchMyLoans",
  async (customerId) => {
    const response = await apiClient.get(`/loans/my/${customerId}`);

    return response.data;
  }
);

// Thunk to fetch Loans from the API
export const fetchLoans = createAsyncThunk("account/fetchLoans", async () => {
  const { data: allLoans } = await apiClient.get(`/loans`);

  const loanFullPayload = await Promise.all(
    allLoans.map(async (loan) => {
      const { data: loanBalance } = await apiClient.get(
        `/bankone/loanAccountBalance/${loan?.customer?.banking?.accountDetails?.CustomerID}`
      );

      return { ...loan, balance: loanBalance };
    })
  );

  return loanFullPayload;
});

// Thunk to fetch All Loans from the API
export const fetchAllLoans = createAsyncThunk(
  "account/fetchAllLoans",
  async () => {
    const response = await apiClient.get(`/loans/all`);

    return response.data;
  }
);

// Thunk to fetch Pending Loans from the API
export const fetchPendingLoans = createAsyncThunk(
  "account/fetchPendingLoans",
  async () => {
    const response = await apiClient.get(`/loans/pending`);

    return response.data;
  }
);

// Thunk to fetch Unbooked Loans from the API
export const fetchUnbookedLoans = createAsyncThunk(
  "account/fetchUnbookedLoans",
  async () => {
    const response = await apiClient.get(`/loans/unbooked`);

    return response.data;
  }
);

// Thunk to fetch account from the API
export const fetchBookedLoans = createAsyncThunk(
  "account/fetchBookedLoans",
  async () => {
    const res = await apiClient.get(`/loans/booked`);

    return res.data;
  }
);
// Thunk to fetch account from the API
export const fetchCompletedLoan = createAsyncThunk(
  "account/fetchCompletedLoan",
  async () => {
    const res = await apiClient.get(`/loans/disbursed`);

    return res.data;
  }
);

// Thunk to fetch account from the API
export const fetchCustomerLoans = createAsyncThunk(
  "account/fetchCustomerLoans",
  async (customerId) => {
    const response = await apiClient.get(`/bankone/getLoansById/${customerId}`);

    return response.data.Message;
  }
);

// Thunk to get loan repayent schedule
export const fetchLoanRepaymentSchedule = createAsyncThunk(
  "account/fetchLoanRepaymentSchedule",
  async (loanAccountNumber) => {
    const response = await apiClient.get(
      `/bankone/getLoanRepaymentSchedule/${loanAccountNumber}`
    );

    return response.data;
  }
);

// Thunk to get loan repayent schedule
export const fetchLoanAccountBal = createAsyncThunk(
  "account/fetchLoanAccountBal",
  async (customerId) => {
    const response = await apiClient.get(
      `/bankone/loanAccountBalance/${customerId}`
    );

    return response.data.Message;
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
    activeLoanRepaymentSchedule: null,
    loansAccountBalance: null,
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

      .addCase(fetchMyLoans.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMyLoans.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.allLoans = action.payload;
      })
      .addCase(fetchMyLoans.rejected, (state, action) => {
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
      })

      .addCase(fetchLoanRepaymentSchedule.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchLoanRepaymentSchedule.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.activeLoanRepaymentSchedule = action.payload;
      })
      .addCase(fetchLoanRepaymentSchedule.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(fetchLoanAccountBal.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchLoanAccountBal.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.loansAccountBalance = action.payload;
      })
      .addCase(fetchLoanAccountBal.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { updateLoanStateValues } = loanSlice.actions;

export default loanSlice.reducer;
