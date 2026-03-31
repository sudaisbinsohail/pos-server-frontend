import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./store/userSlice";
import categoryReducer from "./store/categorySlice";
import brandReducer from "./store/brandSlice";
import supplierSlice from "./store/supplierSlice";
import unitSlice from "./store/unitSlice";
import productSlice from "./store/productSlice";
import customerSlice from "./store/customerSlice";
import  saleSlice from "./store/saleSlice";
import roleSlice from "./store/roleSlice";
import companyReducer from "./store/companySlice"

export const store = configureStore({
  reducer: {
    // Add your reducers here
    users: userReducer,
    category: categoryReducer,
    brand:brandReducer,
    supplier:supplierSlice,
    unit:unitSlice,
    product:productSlice,
    customer:customerSlice,
    sale:saleSlice,
    role:roleSlice,
    company: companyReducer,

  },
  devTools: process.env.NODE_ENV !== "production", // enable dev tools
});