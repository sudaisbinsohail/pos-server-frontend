import React, { useState, useEffect } from "react";
import InputField from "../components/InputFeild";
import ButtonFeild from "../components/ButtonFeild";
import PageHeading from "../components/PageHeading";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getRolesSlice , getRoleByIdSlice } from "../store/roleSlice";
import { createUser } from "../store/userSlice";
import {
  checkCompanySlice,
  createCompanySlice
} from "../store/companySlice";

import { checkAdminExists } from "../store/userSlice"; // if exists

export default function Company() {
  const navigate = useNavigate();

  const [setupStep, setSetupStep] = useState("loading");
  // loading | company | admin | done

  // Form states
  const [companyName, setCompanyName] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [companyPhone, setCompanyPhone] = useState("");

  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
 const roles = useSelector((state) => state.role.list);
 console.log(roles)

  const dispatch = useDispatch();

//  useEffect(() => {
//   const initSetup = async () => {
//     try {
//       // 1️⃣ Initialize default roles
   

//       // 2️⃣ Reload roles AFTER initialization
//       await dispatch(getRolesSlice({ search: "" })).unwrap();

//       // 3️⃣ Now check setup
//       const companyExists = await window.api.checkCompany();
//       const adminExists = await window.api.checkAdmin();

//       if (!companyExists.exists) {
//         setSetupStep("company");
//       } else if (!adminExists.exists) {
//         setSetupStep("admin");
//       } else {
//         navigate("/dashboard");
//       }

//     } catch (error) {
//       console.error("Setup error:", error);
//     }
//   };

//   initSetup();
// }, [dispatch, navigate]);

useEffect(() => {
  const initSetup = async () => {
    try {
      await dispatch(getRolesSlice({ search: "" })).unwrap();

      const companyRes = await dispatch(checkCompanySlice()).unwrap();
      const adminRes = await dispatch(checkAdminExists()).unwrap();
      console.log("company screen",companyRes)
      console.log("company screen",adminRes)

      if (!companyRes.exists) {

        setSetupStep("company");
      } else if (!adminRes.exists) {
        setSetupStep("admin");
      } else {
        navigate("/dashboard");
      }

    } catch (error) {
      console.error("Setup error:", error);
    }
  };

  initSetup();
}, [dispatch, navigate]);
  // STEP 1 – Create Company
  // const handleCompanySubmit = async (e) => {
  //   e.preventDefault();

  //   const result = await window.api.createCompany({
  //     name: companyName,
  //     address: companyAddress,
  //     phone: companyPhone,
  //   });

  //   if (result.success) {
  //     toast.success("Company Created!");
  //     setSetupStep("admin"); // Move to next step
  //   } else {
  //     toast.error(result.error);
  //   }
  // };
  const handleCompanySubmit = async (e) => {
  e.preventDefault();

  try {
    const result = await dispatch(
      createCompanySlice({
        name: companyName,
        address: companyAddress,
        phone: companyPhone,
      })
    ).unwrap();

    toast.success("Company Created!");
    setSetupStep("admin");

  } catch (error) {
    toast.error(error || "Failed to create company");
  }
};

  // STEP 2 – Create Admin
  // const handleAdminSubmit = async (e) => {
  //   e.preventDefault();

  //   // Get Admin role ID
  //   // const rolesResult = await window.api.listRoles({});
  //   const adminRole = roles?.find(r => r.name === 'admin');
    
  //   if (!adminRole) {
  //     toast.error("Admin role not found. Please contact support.");
  //     return;
  //   }

  //   const result = await window.api.createUser({
  //     name: adminName,
  //     email: adminEmail,
  //     password: adminPassword,
  //     role_id: adminRole.id,
  //   });

  //   if (result.success) {
  //     toast.success("Admin Created!");

  //     setTimeout(() => {
  //       navigate("/login");
  //     }, 1200);
  //   } else {
  //     toast.error(result.error);
  //   }
  // };
  const handleAdminSubmit = async (e) => {
  e.preventDefault();

  const adminRole = roles?.find(r => r.name === 'admin');

  if (!adminRole) {
    toast.error("Admin role not found.");
    return;
  }

  try {
    const result = await dispatch(
      createUser({
        name: adminName,
        email: adminEmail,
        password: adminPassword,
        role_id: adminRole.id,
      })
    ).unwrap();

    if (result.success) {
      toast.success("Admin Created!");
      setTimeout(() => navigate("/login"), 1200);
    } else {
      toast.error(result.error);
    }

  } catch (error) {
    toast.error(error || "Failed to create admin");
  }
};


  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-xl ">
        <ToastContainer
          position="top-center"
          autoClose={1200}
          newestOnTop
          closeOnClick
          pauseOnHover={false}
          draggable={false}
          limit={1}
        />

        {setupStep === "loading" && (
          <p>Checking setup...</p>
        )}

        {setupStep === "company" && (
          <>
            <PageHeading title="Company Setup" subtitle="Set your company" />
            <form onSubmit={handleCompanySubmit}>
              <InputField
                label="Company Name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
              />
              <InputField
                label="Company Phone"
                value={companyPhone}
                onChange={(e) => setCompanyPhone(e.target.value)}
                required
              />
              <InputField
                label="Company Address"
                value={companyAddress}
                onChange={(e) => setCompanyAddress(e.target.value)}
                required
              />

              <ButtonFeild type="submit" label="Create Company" />
            </form>
          </>
        )}

        {setupStep === "admin" && (
          <>
            <PageHeading title="Admin Setup" subtitle="Create your admin user" />
            <form onSubmit={handleAdminSubmit}>
              <InputField
                label="Admin Name"
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                required
              />
              <InputField
                label="Admin Email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                required
              />
              <InputField
                label="Admin Password"
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                required
              />

              <ButtonFeild type="submit" label="Create Admin" />
            </form>
          </>
        )}
      </div>
    </div>
  );
}