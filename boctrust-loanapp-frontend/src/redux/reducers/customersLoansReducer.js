import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

//fetch accounts
const apiUrl = import.meta.env.VITE_BASE_URL;

const API_ENDPOINT = `${apiUrl}/api/customers-loans`;

// Thunk to fetch All Customers and their Loan from the API
export const fetchAllCustomersLoans = createAsyncThunk(
  "customersLoans/fetchAllCustomersLoans",
  async () => {
    const response = await axios.get(`${API_ENDPOINT}/`);
    return response.data;
  }
);
// Thunk to fetch Single Customer and Loan
export const fetchSingleCustomerLoans = createAsyncThunk(
  "customersLoans/fetchSingleCustomerLoans",
  async (customerId) => {
    const response = await axios.get(`${API_ENDPOINT}/${customerId}`);

    return response.data;
  }
);


// customer slice
const customersLoansSlice = createSlice({
  name: "customersLoans",
  initialState: {
    customersAndLoans: [],
    selectedCustomerAndLoan: null,
    loanFirstInfo: null,
    status: "idle",
    error: null,
  },
  reducers: {
    updateSelectedCustomerLoanState: (state, action) => {
      state[action.payload.name] = action.payload.value;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCustomersLoans.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllCustomersLoans.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.customersAndLoans = action.payload;
      })
      .addCase(fetchAllCustomersLoans.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      
      .addCase(fetchSingleCustomerLoans.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchSingleCustomerLoans.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.selectedCustomerAndLoan = action.payload;
      })
      .addCase(fetchSingleCustomerLoans.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { updateSelectedCustomerLoanState } = customersLoansSlice.actions;

export default customersLoansSlice.reducer;
