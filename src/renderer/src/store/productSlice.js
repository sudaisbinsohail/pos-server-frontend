// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// // ====================================
// // ASYNC THUNKS
// // ====================================

// // Get all products with filters
// export const getProductsSlice = createAsyncThunk(
//   "product/getProducts",
//   async (filters = {}) => {
//     const result = await window.api.getProducts(filters);
//     return result;
//   }
// );

// // Get product by ID
// export const getProductByIdSlice = createAsyncThunk(
//   "product/getProductById",
//   async (id) => {
//     const result = await window.api.getProductById(id);
//     return result;
//   }
// );

// // Create product
// export const createProductSlice = createAsyncThunk(
//   "product/createProduct",
//   async (data) => {
//     const result = await window.api.createProduct(data);
//     return result;
//   }
// );

// // Update product
// export const updateProductSlice = createAsyncThunk(
//   "product/updateProduct",
//   async ({ id, data }) => {
//     const result = await window.api.updateProduct(id, data);
//     return result;
//   }
// );

// // Delete product
// export const deleteProductSlice = createAsyncThunk(
//   "product/deleteProduct",
//   async (id) => {
//     const result = await window.api.deleteProduct(id);
//     return result;
//   }
// );

// // Restore product
// export const restoreProductSlice = createAsyncThunk(
//   "product/restoreProduct",
//   async (id) => {
//     const result = await window.api.restoreProduct(id);
//     return result;
//   }
// );

// // Bulk delete products
// export const bulkDeleteProductsSlice = createAsyncThunk(
//   "product/bulkDeleteProducts",
//   async (ids) => {
//     const result = await window.api.bulkDeleteProducts(ids);
//     return result;
//   }
// );

// // Get low stock products
// export const getLowStockProductsSlice = createAsyncThunk(
//   "product/getLowStockProducts",
//   async () => {
//     const result = await window.api.getLowStockProducts();
//     return result;
//   }
// );

// // Update product stock
// export const updateProductStockSlice = createAsyncThunk(
//   "product/updateProductStock",
//   async ({ id, quantity, operation }) => {
//     const result = await window.api.updateProductStock(id, quantity, operation);
//     return result;
//   }
// );

// // ====================================
// // SLICE
// // ====================================

// const productSlice = createSlice({
//   name: "product",
//   initialState: {
//     list: [],
//     currentProduct: null,
//     lowStockProducts: [],
//     loading: false,
//     error: null,
//   },
//   reducers: {
//     clearCurrentProduct: (state) => {
//       state.currentProduct = null;
//     },
//     clearError: (state) => {
//       state.error = null;
//     },
//   },
//   extraReducers: (builder) => {
//     // Get Products
//     builder.addCase(getProductsSlice.pending, (state) => {
//       state.loading = true;
//     });
//     builder.addCase(getProductsSlice.fulfilled, (state, action) => {
//       state.loading = false;
//       if (action.payload.success) {
//         state.list = action.payload.products || [];
//       } else {
//         state.error = action.payload.error;
//       }
//     });
//     builder.addCase(getProductsSlice.rejected, (state, action) => {
//       state.loading = false;
//       state.error = action.error.message;
//     });

//     // Get Product By ID
//     builder.addCase(getProductByIdSlice.fulfilled, (state, action) => {
//       if (action.payload.success) {
//         state.currentProduct = action.payload.product;
//       }
//     });

//     // Create Product
//     builder.addCase(createProductSlice.fulfilled, (state, action) => {
//       if (action.payload.success) {
//         state.list.push(action.payload.product);
//       }
//     });

//     // Update Product
//     builder.addCase(updateProductSlice.fulfilled, (state, action) => {
//       if (action.payload.success) {
//         const index = state.list.findIndex(
//           (p) => p.id === action.payload.product.id
//         );
//         if (index !== -1) {
//           state.list[index] = action.payload.product;
//         }
//       }
//     });

//     // Delete Product
//     builder.addCase(deleteProductSlice.fulfilled, (state, action) => {
//       if (action.payload.success) {
//         // Remove from list (soft delete)
//         state.list = state.list.filter((p) => p.id !== action.meta.arg);
//       }
//     });

//     // Get Low Stock Products
//     builder.addCase(getLowStockProductsSlice.fulfilled, (state, action) => {
//       if (action.payload.success) {
//         state.lowStockProducts = action.payload.products || [];
//       }
//     });

//     // Update Stock
//     builder.addCase(updateProductStockSlice.fulfilled, (state, action) => {
//       if (action.payload.success) {
//         const index = state.list.findIndex(
//           (p) => p.id === action.payload.product.id
//         );
//         if (index !== -1) {
//           state.list[index].opening_stock = action.payload.newStock;
//         }
//       }
//     });
//   },
// });

// export const { clearCurrentProduct, clearError } = productSlice.actions;
// export default productSlice.reducer;


import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";

export const getProductsSlice        = createAsyncThunk("product/getProducts",       async (filters = {}) => api.getProducts(filters));
export const getProductByIdSlice     = createAsyncThunk("product/getProductById",    async (id)           => api.getProductById(id));
export const createProductSlice      = createAsyncThunk("product/createProduct",     async (data)         => api.createProduct(data));
export const updateProductSlice      = createAsyncThunk("product/updateProduct",     async ({ id, data }) => api.updateProduct(id, data));
export const deleteProductSlice      = createAsyncThunk("product/deleteProduct",     async (id)           => api.deleteProduct(id));
export const getLowStockProductsSlice= createAsyncThunk("product/getLowStock",       async ()             => api.getLowStockProducts());
export const updateProductStockSlice = createAsyncThunk("product/updateStock",       async ({ id, quantity, operation }) => api.updateProductStock(id, quantity, operation));

const productSlice = createSlice({
  name: "product",
  initialState: {
    list: [],
    currentProduct: null,
    lowStockProducts: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentProduct: (state) => { state.currentProduct = null },
    clearError:          (state) => { state.error = null },
  },
  extraReducers: (builder) => {
    builder
      // List
      .addCase(getProductsSlice.pending,         (state) => { state.loading = true })
      .addCase(getProductsSlice.fulfilled,       (state, action) => {
        state.loading = false;
        if (action.payload.success) state.list = action.payload.products || [];
        else state.error = action.payload.error;
      })
      .addCase(getProductsSlice.rejected,        (state, action) => { state.loading = false; state.error = action.error.message })

      // By ID
      .addCase(getProductByIdSlice.fulfilled,    (state, action) => {
        if (action.payload.success) state.currentProduct = action.payload.product;
      })

      // Create
      .addCase(createProductSlice.fulfilled,     (state, action) => {
        if (action.payload.success) state.list.push(action.payload.product);
        else state.error = action.payload.error;
      })

      // Update
      .addCase(updateProductSlice.fulfilled,     (state, action) => {
        if (action.payload.success) {
          const idx = state.list.findIndex(p => p.id === action.payload.product.id);
          if (idx !== -1) state.list[idx] = action.payload.product;
        } else {
          state.error = action.payload.error;
        }
      })

      // Delete
      .addCase(deleteProductSlice.fulfilled,     (state, action) => {
        if (action.payload.success) state.list = state.list.filter(p => p.id !== action.meta.arg);
        else state.error = action.payload.error;
      })

      // Low stock
      .addCase(getLowStockProductsSlice.fulfilled,(state, action) => {
        if (action.payload.success) state.lowStockProducts = action.payload.products || [];
      })

      // Update stock
      .addCase(updateProductStockSlice.fulfilled, (state, action) => {
        if (action.payload.success) {
          const idx = state.list.findIndex(p => p.id === action.payload.product.id);
          if (idx !== -1) state.list[idx].opening_stock = action.payload.newStock;
        }
      });
  },
});

export const { clearCurrentProduct, clearError } = productSlice.actions;
export default productSlice.reducer;