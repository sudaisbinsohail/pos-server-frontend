// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// // ----------------------------------------------------------
// // Async Thunks
// // ----------------------------------------------------------

// export const createUnitSlice = createAsyncThunk(
//   "unit/createUnitSlice",
//   async (data) => {
//     const result = await window.api.createUnit(data);
//     return result; // { success, error }
//   }
// );

// export const getUnitsSlice = createAsyncThunk(
//   "unit/getUnitsSlice",
//   async (filters) => {
//     const result = await window.api.listUnits(filters);
//     return result.success ? result.units : [];
//   }
// );

// export const updateUnitSlice = createAsyncThunk(
//   "unit/updateUnitSlice",
//   async ({ id, data }) => {
//     const result = await window.api.updateUnit(id, data);
//     return result; // { success, error }
//   }
// );

// export const deleteUnitSlice = createAsyncThunk(
//   "unit/deleteUnitSlice",
//   async (id) => {
//     const result = await window.api.softDeleteUnit(id);
//     return result; // { success, error }
//   }
// );

// export const restoreUnitSlice = createAsyncThunk(
//   "unit/restoreUnitSlice",
//   async (id) => {
//     const result = await window.api.restoreUnit(id);
//     return result; // { success, error }
//   }
// );

// // ----------------------------------------------------------
// // Slice
// // ----------------------------------------------------------

// const unitSlice = createSlice({
//   name: "unit",
//   initialState: {
//     list: [],
//     loading: false,
//     error: null,
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder

//       // CREATE
//       .addCase(createUnitSlice.fulfilled, (state, action) => {
//         if (!action.payload.success) {
//           state.error = action.payload.error;
//         }
//       })

//       // UPDATE
//       .addCase(updateUnitSlice.fulfilled, (state, action) => {
//         if (!action.payload.success) {
//           state.error = action.payload.error;
//         }
//       })

//       // DELETE
//       .addCase(deleteUnitSlice.fulfilled, (state, action) => {
//         if (!action.payload.success) {
//           state.error = action.payload.error;
//         }
//       })

//       // RESTORE
//       .addCase(restoreUnitSlice.fulfilled, (state, action) => {
//         if (!action.payload.success) {
//           state.error = action.payload.error;
//         }
//       })

//       // GET UNITS
//       .addCase(getUnitsSlice.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(getUnitsSlice.fulfilled, (state, action) => {
//         state.list = action.payload;
//         state.loading = false;
//       });
//   },
// });

// export default unitSlice.reducer;
// ─────────────────────────────────────────────────────────────────────────────
// unitSlice.js
// ─────────────────────────────────────────────────────────────────────────────
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";
 
export const getUnitsSlice    = createAsyncThunk("unit/getUnits",    async (filters) => { const r = await api.listUnits(filters);  return r.success ? r.units : [] });
export const createUnitSlice  = createAsyncThunk("unit/createUnit",  async (data)    => api.createUnit(data));
export const updateUnitSlice  = createAsyncThunk("unit/updateUnit",  async ({ id, data }) => api.updateUnit(id, data));
export const deleteUnitSlice  = createAsyncThunk("unit/deleteUnit",  async (id)      => api.softDeleteUnit(id));
export const restoreUnitSlice = createAsyncThunk("unit/restoreUnit", async (id)      => api.restoreUnit(id));
export const sortUnitsSlice   = createAsyncThunk("unit/sortUnits",   async (sortedIds) => api.sortUnits(sortedIds));
 
const unitSlice = createSlice({
  name: "unit",
  initialState: { list: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUnitsSlice.pending,    (state) => { state.loading = true })
      .addCase(getUnitsSlice.fulfilled,  (state, action) => { state.list = action.payload; state.loading = false })
      .addCase(createUnitSlice.fulfilled, (state, action) => { if (!action.payload.success) state.error = action.payload.error })
      .addCase(updateUnitSlice.fulfilled, (state, action) => { if (!action.payload.success) state.error = action.payload.error })
      .addCase(deleteUnitSlice.fulfilled, (state, action) => { if (!action.payload.success) state.error = action.payload.error })
      .addCase(restoreUnitSlice.fulfilled,(state, action) => { if (!action.payload.success) state.error = action.payload.error });
  },
});
// export const unitReducer = unitSlice.reducer;
export default unitSlice.reducer;
 