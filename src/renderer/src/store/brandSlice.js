// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


// // ======================================================
// // CREATE BRAND
// // ======================================================
// export const createBrandSlice = createAsyncThunk(
//   "brand/createBrandSlice",
//   async (data) => {
//     const result = await window.api.createBrand(data);
//     return result; // { success, brand, error }
//   }
// );

// // ======================================================
// // GET ALL BRANDS
// // ======================================================
// export const getBrandsSlice = createAsyncThunk(
//   "brand/getBrandsSlice",
//   async () => {
//     const result = await window.api.getBrands();
//     return result.success ? result.brands : [];
//   }
// );

// // ======================================================
// // UPDATE BRAND
// // ======================================================
// export const updateBrandSlice = createAsyncThunk(
//   "brand/updateBrandSlice",
//   async ({ id, data }) => {
//     const result = await window.api.updateBrand(id, data);
//     return result; // { success, error }
//   }
// );

// // ======================================================
// // DELETE BRAND
// // ======================================================
// export const deleteBrandSlice = createAsyncThunk(
//   "brand/deleteBrandSlice",
//   async (id) => {
//     const result = await window.api.deleteBrand(id);
//     return result; // { success, error }
//   }
// );


// // ======================================================
// // SLICE
// // ======================================================
// const brandSlice = createSlice({
//   name: "brand",
//   initialState: {
//     list: [],
//     loading: false,
//     error: null,
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder

//       // CREATE BRAND
//       .addCase(createBrandSlice.fulfilled, (state, action) => {
//         if (!action.payload.success) {
//           state.error = action.payload.error;
//         }
//       })

//       // UPDATE BRAND
//       .addCase(updateBrandSlice.fulfilled, (state, action) => {
//         if (!action.payload.success) {
//           state.error = action.payload.error;
//         }
//       })

//       // DELETE BRAND
//       .addCase(deleteBrandSlice.fulfilled, (state, action) => {
//         if (!action.payload.success) {
//           state.error = action.payload.error;
//         }
//       })

//       // GET BRANDS
//       .addCase(getBrandsSlice.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(getBrandsSlice.fulfilled, (state, action) => {
//         state.list = action.payload;
//         state.loading = false;
//       });
//   },
// });

// export default brandSlice.reducer;
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";

export const getBrandsSlice = createAsyncThunk("brand/getBrandsSlice", async () => {
  const result = await api.getBrands();
  return result.success ? result.brands : [];
});

export const createBrandSlice = createAsyncThunk("brand/createBrandSlice", async (data) => {
  return await api.createBrand(data);
});

export const updateBrandSlice = createAsyncThunk("brand/updateBrandSlice", async ({ id, data }) => {
  return await api.updateBrand(id, data);
});

export const deleteBrandSlice = createAsyncThunk("brand/deleteBrandSlice", async (id) => {
  return await api.deleteBrand(id);
});

const brandSlice = createSlice({
  name: "brand",
  initialState: { list: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getBrandsSlice.pending,    (state) => { state.loading = true })
      .addCase(getBrandsSlice.fulfilled,  (state, action) => { state.list = action.payload; state.loading = false })
      .addCase(createBrandSlice.fulfilled,(state, action) => { if (!action.payload.success) state.error = action.payload.error })
      .addCase(updateBrandSlice.fulfilled,(state, action) => { if (!action.payload.success) state.error = action.payload.error })
      .addCase(deleteBrandSlice.fulfilled,(state, action) => { if (!action.payload.success) state.error = action.payload.error });
  },
});

export default brandSlice.reducer;