import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {
  allPermisions,
  allUserRoles,
} from "../../components/dashboard/admindashboard/usersmanager/adminRoles";

//fetch admin
const apiUrl = import.meta.env.VITE_BASE_URL;

const API_ENDPOINT = `${apiUrl}/api/admin/users`;

// Thunk to fetch admin from the API
export const fetchAdmins = createAsyncThunk("admin/fetchAdmins", async () => {
  const response = await axios.get(API_ENDPOINT);
  return response.data;
});
// Thunk to fetch admin from the API
export const fetchRoles = createAsyncThunk("admin/fetRoles", async () => {
  return [
    { _id: 2, value: "md", label: "MD", description: " ROle" },
    { _id: 3, value: "coo", label: "COO", description: " ROle" },
    {
      _id: 4,
      value: "credit_head",
      label: "Credit Head",
      description: " ROle",
    },
    {
      _id: 5,
      value: "credit_analyst",
      label: "Credit Analyst",
      description: " ROle",
    },
    {
      _id: 6,
      value: "operation_staff",
      label: "Operation Staff",
      description: " ROle",
    },
    {
      _id: 7,
      value: "loan_officer",
      label: "Loan Officer",
      description: " ROle",
    },
    {
      _id: 8,
      value: "marketing_staff",
      label: "Marketing staff",
      description: " ROle",
    },
  ];
});
export const fetchRolesAndPermisions = createAsyncThunk(
  "admin/fetchRolesAndPermisions",
  async () => {
    return allUserRoles;
  }
);
export const fetchPermissions = createAsyncThunk(
  "admin/fetchPermissions",
  async () => {
    return allPermisions;
  }
);

// admin slice
const adminSlice = createSlice({
  name: "admin",
  initialState: {
    admins: [],
    roles: [],
    rolesAndPermission: null,
    allPermisions: null,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdmins.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAdmins.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.admins = action.payload;
      })
      .addCase(fetchAdmins.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(fetchRoles.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.roles = action.payload;
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchRolesAndPermisions.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchRolesAndPermisions.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.rolesAndPermission = action.payload;
      })
      .addCase(fetchRolesAndPermisions.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchPermissions.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPermissions.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.allPermisions = action.payload;
      })
      .addCase(fetchPermissions.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      
      ;
  },
});

export default adminSlice.reducer;
