import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ======================================================
// CREATE SALE
// ======================================================
export const createSaleSlice = createAsyncThunk(
  "sale/createSaleSlice",
  async (data) => {
    const result = await window.api.createSale(data);
    return result;
  }
);

// ======================================================
// GET ALL SALES
// ======================================================
export const getSalesSlice = createAsyncThunk(
  "sale/getSalesSlice",
  async (filters) => {
    const result = await window.api.listSales(filters);
    return result.success ? result.sales : [];
  }
);

// ======================================================
// GET SALE BY ID
// ======================================================
export const getSaleByIdSlice = createAsyncThunk(
  "sale/getSaleByIdSlice",
  async (id) => {
    const result = await window.api.getSaleById(id);
    return result;
  }
);

// ======================================================
// DELETE SALE
// ======================================================
export const deleteSaleSlice = createAsyncThunk(
  "sale/deleteSaleSlice",
  async (id) => {
    const result = await window.api.deleteSale(id);
    return result;
  }
);

// ======================================================
// GET SALES STATS
// ======================================================
export const getSalesStatsSlice = createAsyncThunk(
  "sale/getSalesStatsSlice",
  async (filters) => {
    const result = await window.api.getSalesStats(filters);
    return result;
  }
);

// ======================================================
// SLICE
// ======================================================
const saleSlice = createSlice({
  name: "sale",
  initialState: {
    list: [],
    currentSale: null,
    stats: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentSale: (state) => {
      state.currentSale = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createSaleSlice.fulfilled, (state, action) => {
        if (!action.payload.success) {
          state.error = action.payload.error;
        }
      })
      .addCase(deleteSaleSlice.fulfilled, (state, action) => {
        if (!action.payload.success) {
          state.error = action.payload.error;
        }
      })
      .addCase(getSalesSlice.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSalesSlice.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading = false;
      })
      .addCase(getSaleByIdSlice.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.currentSale = action.payload.sale;
        }
      })
      .addCase(getSalesStatsSlice.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.stats = action.payload.stats;
        }
      });
  },
});

export const { clearCurrentSale } = saleSlice.actions;
export default saleSlice.reducer;


// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import api from "../api";

// export const createSaleSlice    = createAsyncThunk("sale/createSale",   async (data)    => api.createSale(data));
// export const getSalesSlice      = createAsyncThunk("sale/getSales",     async (filters) => { const r = await api.listSales(filters); return r.success ? r.sales : [] });
// export const getSaleByIdSlice   = createAsyncThunk("sale/getSaleById",  async (id)      => api.getSaleById(id));
// export const deleteSaleSlice    = createAsyncThunk("sale/deleteSale",   async (id)      => api.deleteSale(id));
// export const getSalesStatsSlice = createAsyncThunk("sale/getSalesStats",async (filters) => api.getSalesStats(filters));

// const saleSlice = createSlice({
//   name: "sale",
//   initialState: { list: [], currentSale: null, stats: null, loading: false, error: null },
//   reducers: {
//     clearCurrentSale: (state) => { state.currentSale = null },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(getSalesSlice.pending,       (state) => { state.loading = true })
//       .addCase(getSalesSlice.fulfilled,     (state, action) => { state.list = action.payload; state.loading = false })
//       .addCase(createSaleSlice.fulfilled,   (state, action) => { if (!action.payload.success) state.error = action.payload.error })
//       .addCase(deleteSaleSlice.fulfilled,   (state, action) => { if (!action.payload.success) state.error = action.payload.error })
//       .addCase(getSaleByIdSlice.fulfilled,  (state, action) => { if (action.payload.success) state.currentSale = action.payload.sale })
//       .addCase(getSalesStatsSlice.fulfilled,(state, action) => { if (action.payload.success) state.stats = action.payload.stats });
//   },
// });

// export const { clearCurrentSale } = saleSlice.actions;
// export default saleSlice.reducer;