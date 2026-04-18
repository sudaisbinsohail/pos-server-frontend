import React, { useEffect, useState } from "react";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import Company from "./pages/Company";
import Users from "./pages/Users";
import Product from "./pages/Product";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Category from "./pages/Category";
import Customer from "./pages/Customer";
import Supplier from "./pages/Supplier";
import Stocks from "./pages/Stock";
import Brand from "./pages/Brand";
import Units from "./pages/Units";
import SettingCompany from "./pages/SettingCompany";
import POS from "./pages/MainPos"
import CustomerManagement from "./pages/Customer";
import SalesHistory from "./pages/SaleHistory";
import RoleManagement from "./pages/RolesPermissions";
import { checkCompanySlice } from "./store/companySlice";
import { checkAdminExists } from "./store/userSlice";
import { getProfile } from "./store/userSlice";
import Stores from "./pages/Stores";
import Terminals from "./pages/Terminals";

export default function App() {
  const [initialRoute, setInitialRoute] = useState(null);
  const dispatch = useDispatch();

  // useEffect(() => {
  //   async function init() {
  //     const companyStatus = await window.api.checkCompany();
  //     const adminStatus = await window.api.checkAdmin();
  //     const session = await window.api.getUserSession();
  //     console.log("Company exists:", companyStatus.exists);
  //     console.log("Admin exists:", adminStatus.exists);

  //     if (!companyStatus.exists || !adminStatus.exists) {
  //       setInitialRoute("/company");
  //     } else if (!session || !session.user) {
  //       setInitialRoute("/login");
  //     } else {
  //       setInitialRoute("/dashboard");
  //     }
  //   }

  //   init();

  // }, []);

  useEffect(() => {
    async function init() {
      try {
        const companyStatus = await dispatch(checkCompanySlice()).unwrap();
        const adminStatus = await dispatch(checkAdminExists()).unwrap();
        const session = await dispatch(getProfile()).unwrap();

        console.log("Company exists:", companyStatus);
        console.log("Admin exists:", adminStatus);

        if (!companyStatus.exists || !adminStatus.exists) {
          setInitialRoute("/company");
        } else if (!session?.success || !session?.user) {
          setInitialRoute("/login");
        } else {
          setInitialRoute("/dashboard");
        }

      } catch (error) {
        console.error("Init error:", error);
        setInitialRoute("/login"); // fallback
      }
    }

    init();
  }, [dispatch]);

  // Show nothing until the first route is known
  if (!initialRoute) return null;

  return (
    <Router>
      <Routes>
        {/* Initial redirection only ONCE */}
        <Route path="/" element={<Navigate to={initialRoute} replace />} />

        {/* Pages */}
        <Route path="/company" element={<Company />} />
        <Route path="/login" element={<Login />} />

        {/* Dashboard and nested pages */}

        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<Users />} />
          <Route path="users" element={<Users />} />
          <Route path="pos" element={<POS />} />
          <Route path="customermanagement" element={<CustomerManagement />} />
          <Route path="salehistory" element={<SalesHistory />} />
          <Route path="products" element={<Product />} />
          <Route path="category" element={<Category />} />
          <Route path="customer" element={<Customer />} />
          <Route path="stock" element={<Stocks />} />
          <Route path="supplier" element={<Supplier />} />
          <Route path="brand" element={<Brand />} />
          <Route path="unit" element={<Units />} />
          <Route path="settingCompany" element={<SettingCompany />} />
          <Route path="roles" element={<RoleManagement />} />
          <Route path="stores" element={<Stores />} />
          <Route path="terminals" element={<Terminals />} />

        </Route>

        {/* If route not found */}
        <Route path="*" element={<Navigate to={initialRoute} replace />} />
      </Routes>
    </Router>
  );
}
