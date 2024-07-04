import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

//fetch admin
const apiUrl = import.meta.env.VITE_BASE_URL;

// Thunk to fetch admin from the API
export const fetchAdmins = createAsyncThunk("admin/fetchAdmins", async () => {
  const response = await axios.get(`${apiUrl}/api/admin/users`);
  return response.data;
});

export const fetchRolesAndPermisions = createAsyncThunk(
  "admin/fetchRolesAndPermisions",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${apiUrl}/api/role`);

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

export const fetchPermissions = createAsyncThunk(
  "admin/fetchPermissions",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${apiUrl}/api/role/permission`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

export const addNewRole = createAsyncThunk(
  "admin/addNewRole",
  async (payload, thunkAPI) => {
    try {
      await axios.post(`${apiUrl}/api/role`, payload);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.error || "Something went wrong"
      );
    }
  }
);
export const updateRole = createAsyncThunk(
  "admin/updateRole",
  async ({ payload, roleId }, thunkAPI) => {
    try {
      await axios.put(`${apiUrl}/api/role/${roleId}`, payload);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

// admin slice
const adminSlice = createSlice({
  name: "admin",
  initialState: {
    admins: [],
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
      .addCase(addNewRole.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addNewRole.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(addNewRole.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default adminSlice.reducer;
