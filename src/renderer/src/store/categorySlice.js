// import { createSlice , createAsyncThunk } from "@reduxjs/toolkit";



// export const createCategorySlice = createAsyncThunk("category/createCategorySlice", async (data) => {
//     console.log("slice dats ............." ,data)
//   const result = await window.api.createCategory(data);
//   return result; // { success, error }
// });


// export const getCategoriesSlice = createAsyncThunk("category/getCategoriesSlice", async (id) => {
//   const result = await window.api.getCategories(id);
//   return result.success ? result.categories : [];
// });


// export const updateCategorySlice = createAsyncThunk("category/updateCategorySlice", async ({id,data}) => {
//     console.log("slice dats ............." ,id,data)
//   const result = await window.api.updateCategory(id,data);
//   return result; // { success, error }
// });


// export const deleteCategorySlice = createAsyncThunk("category/deleteCategorySlice", async (id) => {
//   const result = await window.api.deleteCategory(id);
//   return result; // { success, error }
// });

// const categorySlice = createSlice({
//     name:"category",
//      initialState: {
//     list: [],
//     loading: false,
//     error: null,
//   },
//   reducers:{},
//   extraReducers:(builder)=>{
//   builder

//    // Create User
//         .addCase(createCategorySlice.fulfilled, (state, action) => {
//           if (action.payload.success) {
//             // refresh list manually because electron returns no object
//           } else {
//             state.error = action.payload.error;
//           }
//         })
//         .addCase(updateCategorySlice.fulfilled, (state, action) => {
//           if (action.payload.success) {
//             // refresh list manually because electron returns no object
//           } else {
//             state.error = action.payload.error;
//           }
//         })
//         .addCase(deleteCategorySlice.fulfilled, (state, action) => {
//           if (action.payload.success) {
//             // refresh list manually because electron returns no object
//           } else {
//             state.error = action.payload.error;
//           }
//         })
//           .addCase(getCategoriesSlice.pending, (state, action) => {
//          state.loading=true
//         })
//           .addCase(getCategoriesSlice.fulfilled, (state, action) => {
//           state.list = action.payload;
//            state.loading = false;
//         })

//     }
// })

// export default categorySlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";


export const getCategoriesSlice = createAsyncThunk("category/getCategoriesSlice", async (id) => {
  // console.log("print",id)
  const result = await api.getCategories(id);
  // if(id != null){
  //   console.log("inside")
  //   const result = await api.getCategoryById(id);
  // }
  return result.success ? result.categories : [];
});

export const getCategoriesTreeSlice = createAsyncThunk("category/getCategoriesTreeSlice", async () => {
  const result = await api.getCategoriesTree();
  return result.success ? result.categories : [];
});

export const createCategorySlice = createAsyncThunk("category/createCategorySlice", async (data) => {
  return await api.createCategory(data);
});

export const updateCategorySlice = createAsyncThunk("category/updateCategorySlice", async ({ id, data }) => {
  return await api.updateCategory(id, data);
});

export const deleteCategorySlice = createAsyncThunk("category/deleteCategorySlice", async (id) => {
  return await api.deleteCategory(id);
});

const categorySlice = createSlice({
  name: "category",
  initialState: { list: [], tree: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCategoriesSlice.pending,      (state) => { state.loading = true })
      .addCase(getCategoriesSlice.fulfilled,    (state, action) => { state.list = action.payload; state.loading = false })
      .addCase(getCategoriesTreeSlice.fulfilled,(state, action) => { state.tree = action.payload })
      .addCase(createCategorySlice.fulfilled,   (state, action) => { if (!action.payload.success) state.error = action.payload.error })
      .addCase(updateCategorySlice.fulfilled,   (state, action) => { if (!action.payload.success) state.error = action.payload.error })
      .addCase(deleteCategorySlice.fulfilled,   (state, action) => { if (!action.payload.success) state.error = action.payload.error });
  },
});

export default categorySlice.reducer;