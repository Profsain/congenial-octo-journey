import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

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
// Thunk to fetch Single Customer
export const fetchSingleCustomer = createAsyncThunk(
  "account/fetchSingleCustomer",
  async (customerId) => {
    const response = await axios.get(`${API_ENDPOINT}/customer/${customerId}`);

    return response.data;
  }
);

// Thunk to  Create Bank One account
export const createBankoneCustomer = createAsyncThunk(
  "account/createBankoneCustomer",
  async (customerId, thunkAPI) => {
    try {
      await axios.post(
        `${apiUrl}/api/bankone/newCustomerAccount/${customerId}`
      );
    } catch (error) {
      if (error instanceof AxiosError) {
        return thunkAPI.rejectWithValue(error.response?.data?.message);
      }
      return thunkAPI.rejectWithValue("Could not Approve and Create Account");
    }
  }
);

// customer slice
const customerSlice = createSlice({
  name: "customers",
  initialState: {
    customers: [],
    selectedCustomer: null,
    loanFirstInfo: null,
    status: "idle",
    error: null,
  },
  reducers: {
    updateCustomerStateValues: (state, action) => {
      state[action.payload.name] = action.payload.value;
    },
  },
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
      })

      .addCase(createBankoneCustomer.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createBankoneCustomer.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(createBankoneCustomer.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { updateCustomerStateValues } = customerSlice.actions;

export default customerSlice.reducer;
