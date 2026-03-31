// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// // ======================================================
// // CREATE CUSTOMER
// // ======================================================
// export const createCustomerSlice = createAsyncThunk(
//   "customer/createCustomerSlice",
//   async (data) => {
//     const result = await window.api.createCustomer(data);
//     return result;
//   }
// );

// // ======================================================
// // GET ALL CUSTOMERS
// // ======================================================
// export const getCustomersSlice = createAsyncThunk(
//   "customer/getCustomersSlice",
//   async (filters) => {
//     const result = await window.api.listCustomers(filters);
//     return result.success ? result.customers : [];
//   }
// );

// // ======================================================
// // UPDATE CUSTOMER
// // ======================================================
// export const updateCustomerSlice = createAsyncThunk(
//   "customer/updateCustomerSlice",
//   async ({ id, data }) => {
//     const result = await window.api.updateCustomer(id, data);
//     return result;
//   }
// );

// // ======================================================
// // DELETE CUSTOMER
// // ======================================================
// export const deleteCustomerSlice = createAsyncThunk(
//   "customer/deleteCustomerSlice",
//   async (id) => {
//     const result = await window.api.deleteCustomer(id);
//     return result;
//   }
// );

// // ======================================================
// // SLICE
// // ======================================================
// const customerSlice = createSlice({
//   name: "customer",
//   initialState: {
//     list: [],
//     loading: false,
//     error: null,
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(createCustomerSlice.fulfilled, (state, action) => {
//         if (!action.payload.success) {
//           state.error = action.payload.error;
//         }
//       })
//       .addCase(updateCustomerSlice.fulfilled, (state, action) => {
//         if (!action.payload.success) {
//           state.error = action.payload.error;
//         }
//       })
//       .addCase(deleteCustomerSlice.fulfilled, (state, action) => {
//         if (!action.payload.success) {
//           state.error = action.payload.error;
//         }
//       })
//       .addCase(getCustomersSlice.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(getCustomersSlice.fulfilled, (state, action) => {
//         state.list = action.payload;
//         state.loading = false;
//       });
//   },
// });

// export default customerSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";

export const getCustomersSlice  = createAsyncThunk("customer/getCustomers",  async (filters) => { const r = await api.listCustomers(filters); return r.success ? r.customers : [] });
export const createCustomerSlice= createAsyncThunk("customer/createCustomer",async (data)    => api.createCustomer(data));
export const updateCustomerSlice= createAsyncThunk("customer/updateCustomer",async ({ id, data }) => api.updateCustomer(id, data));
export const deleteCustomerSlice= createAsyncThunk("customer/deleteCustomer",async (id)      => api.deleteCustomer(id));
 
const customerSlice = createSlice({
  name: "customer",
  initialState: { list: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCustomersSlice.pending,    (state) => { state.loading = true })
      .addCase(getCustomersSlice.fulfilled,  (state, action) => { state.list = action.payload; state.loading = false })
      .addCase(createCustomerSlice.fulfilled,(state, action) => { if (!action.payload.success) state.error = action.payload.error })
      .addCase(updateCustomerSlice.fulfilled,(state, action) => { if (!action.payload.success) state.error = action.payload.error })
      .addCase(deleteCustomerSlice.fulfilled,(state, action) => { if (!action.payload.success) state.error = action.payload.error });
  },
});
export default customerSlice.reducer;
 