// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// // ======================================================
// // CREATE SUPPLIER
// // ======================================================
// export const createSupplierSlice = createAsyncThunk(
//   "supplier/createSupplierSlice",
//   async (data) => {
//     const result = await window.api.createSupplier(data);
//     return result; // { success, supplier, error }
//   }
// );

// // ======================================================
// // GET ALL SUPPLIERS
// // ======================================================
// export const getSupplierSlice = createAsyncThunk(
//   "supplier/getSuppliersSlice",
//   async (filters) => {
//     const result = await window.api.listSuppliers(filters);
//     return result.success ? result.suppliers : [];
//   }
// );

// // ======================================================
// // UPDATE SUPPLIER
// // ======================================================
// export const updateSupplierSlice = createAsyncThunk(
//   "supplier/updateSupplierSlice",
//   async ({ id, data }) => {
//     const result = await window.api.updateSupplier(id, data);
//     return result; // { success, error }
//   }
// );

// // ======================================================
// // DELETE SUPPLIER
// // ======================================================
// export const deleteSupplierSlice = createAsyncThunk(
//   "supplier/deleteSupplierSlice",
//   async (id) => {
//     const result = await window.api.deleteSupplier(id);
//     return result; // { success, error }
//   }
// );

// // ======================================================
// // SLICE
// // ======================================================
// const supplierSlice = createSlice({
//   name: "supplier",
//   initialState: {
//     list: [],
//     loading: false,
//     error: null,
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder

//       // CREATE SUPPLIER
//       .addCase(createSupplierSlice.fulfilled, (state, action) => {
//         if (!action.payload.success) {
//           state.error = action.payload.error;
//         }
//       })

//       // UPDATE SUPPLIER
//       .addCase(updateSupplierSlice.fulfilled, (state, action) => {
//         if (!action.payload.success) {
//           state.error = action.payload.error;
//         }
//       })

//       // DELETE SUPPLIER
//       .addCase(deleteSupplierSlice.fulfilled, (state, action) => {
//         if (!action.payload.success) {
//           state.error = action.payload.error;
//         }
//       })

//       // GET SUPPLIERS
//       .addCase(getSupplierSlice.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(getSupplierSlice.fulfilled, (state, action) => {
//         state.list = action.payload;
//         state.loading = false;
//       });
//   },
// });

// export default supplierSlice.reducer;
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";

// const supplierSliceX = createSlice({
//   name: "supplier",
//   initialState: { list: [], loading: false, error: null },
//   reducers: {},
//   extraReducers: () => {},
// });
 
export const getSupplierSlice    = createAsyncThunk("supplier/getSuppliers",   async (filters) => { const r = await api.listSuppliers(filters); return r.success ? r.suppliers : [] });
export const createSupplierSlice = createAsyncThunk("supplier/createSupplier", async (data)    => api.createSupplier(data));
export const updateSupplierSlice = createAsyncThunk("supplier/updateSupplier", async ({ id, data }) => api.updateSupplier(id, data));
export const deleteSupplierSlice = createAsyncThunk("supplier/deleteSupplier", async (id)      => api.deleteSupplier(id));
 
const supplierSlice = createSlice({
  name: "supplier",
  initialState: { list: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getSupplierSlice.pending,    (state) => { state.loading = true })
      .addCase(getSupplierSlice.fulfilled,  (state, action) => { state.list = action.payload; state.loading = false })
      .addCase(createSupplierSlice.fulfilled,(state, action) => { if (!action.payload.success) state.error = action.payload.error })
      .addCase(updateSupplierSlice.fulfilled,(state, action) => { if (!action.payload.success) state.error = action.payload.error })
      .addCase(deleteSupplierSlice.fulfilled,(state, action) => { if (!action.payload.success) state.error = action.payload.error });
  },
});
export default supplierSlice.reducer;
 
