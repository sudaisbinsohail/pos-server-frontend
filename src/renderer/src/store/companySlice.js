import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";

// ─────────────────────────────────────────────
// THUNKS
// ─────────────────────────────────────────────

// Check if company exists
export const checkCompanySlice = createAsyncThunk(
  "company/check",
  async (_, { rejectWithValue }) => {
    try {
      return await api.checkCompany();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Get first company
export const getCompanySlice = createAsyncThunk(
  "company/get",
  async (_, { rejectWithValue }) => {
    try {
      return await api.getFirstCompany();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Create company
export const createCompanySlice = createAsyncThunk(
  "company/create",
  async (data, { rejectWithValue }) => {
    try {
      return await api.createCompany(data);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Update company
export const updateCompanySlice = createAsyncThunk(
  "company/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await api.updateCompany(id, data);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ─────────────────────────────────────────────
// SLICE
// ─────────────────────────────────────────────

const companySlice = createSlice({
  name: "company",
  initialState: {
    company: null,
    exists: false,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      // CHECK
      .addCase(checkCompanySlice.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkCompanySlice.fulfilled, (state, action) => {
        state.loading = false;
        state.exists = action.payload.exists;
      })
      .addCase(checkCompanySlice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET
      .addCase(getCompanySlice.fulfilled, (state, action) => {
        state.company = action.payload.company;
      })

      // CREATE
      .addCase(createCompanySlice.pending, (state) => {
        state.loading = true;
      })
      .addCase(createCompanySlice.fulfilled, (state, action) => {
        state.loading = false;
        state.company = action.payload.company;
        state.exists = true;
      })
      .addCase(createCompanySlice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE
      .addCase(updateCompanySlice.fulfilled, (state, action) => {
        state.company = action.payload.company;
      });
  },
});

export default companySlice.reducer;