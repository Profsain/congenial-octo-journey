import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

//fetch accounts
const apiUrl = import.meta.env.VITE_BASE_URL;

const API_ENDPOINT = `${apiUrl}/api/customer`;

// Thunk to fetch account from the API
export const fetchAllCustomer = createAsyncThunk(
  "account/fetchAllCustomer",
  async () => {
    const response = await axios.get(`${API_ENDPOINT}/customers`);
    return response.data;
  }
);
// Thunk to fetch account from the API
export const fetchSingleCustomer = createAsyncThunk(
  "account/fetchSingleCustomer",
  async (customerId) => {
    const response = await axios.get(`${API_ENDPOINT}/customer/${customerId}`);

    return response.data;
  }
);

// customer slice
const customerSlice = createSlice({
  name: "customers",
  initialState: {
    customers: [],
    selectedCustomer: null,
    customerApprovalEnum: {
      approved: "approved",
      declined: "declined",
      pending: "pending",
    },
    loanStatusEnum: {
      booked: "booked",
      with_co: "with co",
      with_credit: "with credit",
      with_operations: "with operations",
      completed: "completed",
    },
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCustomer.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllCustomer.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.customers = action.payload;
      })
      .addCase(fetchAllCustomer.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchSingleCustomer.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchSingleCustomer.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.selectedCustomer = action.payload;
      })
      .addCase(fetchSingleCustomer.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default customerSlice.reducer;
