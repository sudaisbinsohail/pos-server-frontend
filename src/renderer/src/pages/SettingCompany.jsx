// import React, { useEffect, useState } from "react";
// import InputField from "../components/InputFeild";
// import ButtonFeild from "../components/ButtonFeild";
// import PageHeading from "../components/PageHeading";
// import { ToastContainer, toast } from "react-toastify";
// import { getCountries } from "node-countries";
// import DropdownFeild from "../components/DropdownFeild";

// // Load once outside component
// const countriesData = getCountries();


// export default function SettingCompany() {
//   const [loading, setLoading] = useState(true);

//   const [companyId, setCompanyId] = useState(null);
//   const [companyName, setCompanyName] = useState("");
//   const [companyAddress, setCompanyAddress] = useState("");
//   const [companyPhone, setCompanyPhone] = useState("");
//   const [country, setCountry] = useState("");
//   const [currency, setCurrency] = useState("PKR");




//     // AUTO COUNTRY → STATE → CURRENCY
//   const countryOptions = countriesData.map((c) => c.name);
//   const selectedCountry = countriesData.find((c) => c.name === country);
//   const autoCurrency = selectedCountry?.currency;

//   const handleCountryChange = (value) => {
//     setCountry(value);
//     const found = countriesData.find((c) => c.name === value);
//     setCurrency(found?.currencies[0] || "PKR");
//   };

//   useEffect(() => {
//     async function loadCompany() {
//       try {
//         // If single-company app, you can hardcode ID = 1
//          let user = await window.api.getUserSession();
//          console.log(user)
//         const res = await window.api.getCompany(user.user.company_id);
//         console.log(res)

//         if (res.success) {
//           const company = res.company.dataValues;
//           setCompanyId(company.id);
//           setCompanyName(company.name);
//           setCompanyAddress(company.address);
//           setCompanyPhone(company.phone);
//           setCurrency(company.currency);
//           setCountry(company.country)
//         } else {
//           toast.error("Failed to load company");
//         }
//       } catch (err) {
//         toast.error("Something went wrong");
//       } finally {
//         setLoading(false);
//       }
//     }

//     loadCompany();
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const res = await window.api.updateCompany(companyId, {
//       name: companyName,
//       address: companyAddress,
//       phone: companyPhone,
//       country:country,
//       currency:currency
//     });

//     if (res.success) {
//       toast.success("Company updated successfully");
//     } else {
//       toast.error(res.error);
//     }
//   };

//   if (loading) {
//     return <p className="p-6">Loading company...</p>;
//   }

//   return (
//     <div className="p-6 max-w-xl">
//       <ToastContainer />

//       <PageHeading
//         title="Company Settings"
//         subtitle="Manage your company information"
//       />

//       <form onSubmit={handleSubmit}>
//         <InputField
//           label="Company Name"
//           value={companyName}
//           onChange={(e) => setCompanyName(e.target.value)}
//           required
//         />

//         <InputField
//           label="Company Phone"
//           value={companyPhone}
//           onChange={(e) => setCompanyPhone(e.target.value)}
//           required
//         />

//         <InputField
//           label="Company Address"
//           value={companyAddress}
//           onChange={(e) => setCompanyAddress(e.target.value)}
//           required
//         />

//            <DropdownFeild label="Country" value={country} onChange={handleCountryChange} options={countryOptions} searchable={true} />
//            <DropdownFeild label="Currency" value={currency} onChange={setCurrency} options={[autoCurrency]} />
           

//         <ButtonFeild type="submit" label="Save Changes" />
//       </form>
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import InputField from "../components/InputFeild";
import ButtonFeild from "../components/ButtonFeild";
import PageHeading from "../components/PageHeading";
import { ToastContainer, toast } from "react-toastify";
import { getCountries } from "node-countries";
import DropdownFeild from "../components/DropdownFeild";
import { useDispatch, useSelector } from "react-redux";
import {
  getCompanySlice,
  updateCompanySlice
} from "../store/companySlice";

// Load once
const countriesData = getCountries();

export default function SettingCompany() {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);

  const [companyId, setCompanyId] = useState(null);
  const [companyName, setCompanyName] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [companyPhone, setCompanyPhone] = useState("");
  const [country, setCountry] = useState("");
  const [currency, setCurrency] = useState("PKR");

  // ✅ Get logged-in user from Redux
  const user = useSelector((state) => state.users.currentUser);

  // COUNTRY LOGIC
  const countryOptions = countriesData.map((c) => c.name);
  const selectedCountry = countriesData.find((c) => c.name === country);
  const currencyOptions = selectedCountry?.currencies || ["PKR"];

  const handleCountryChange = (value) => {
    setCountry(value);
    const found = countriesData.find((c) => c.name === value);
    setCurrency(found?.currencies?.[0] || "PKR");
  };

  // ✅ LOAD COMPANY
  useEffect(() => {
    async function loadCompany() {
      try {
        const res = await dispatch(getCompanySlice()).unwrap();

        if (res.success) {
          const company = res.company;

          setCompanyId(company.id);
          setCompanyName(company.name);
          setCompanyAddress(company.address);
          setCompanyPhone(company.phone);
          setCurrency(company.currency);
          setCountry(company.country); // ✅ FIXED
        } else {
          toast.error("Failed to load company");
        }

      } catch (err) {
        toast.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadCompany();
  }, [dispatch]);

  // ✅ UPDATE COMPANY
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await dispatch(
        updateCompanySlice({
          id: companyId,
          data: {
            name: companyName,
            address: companyAddress,
            phone: companyPhone,
            country: country,   // ✅ FIXED
            currency: currency,
          },
        })
      ).unwrap();

      if (res.success) {
        toast.success("Company updated successfully");
      } else {
        toast.error(res.error);
      }

    } catch (err) {
      toast.error(err);
    }
  };

  if (loading) {
    return <p className="p-6">Loading company...</p>;
  }

  return (
    <div className="p-6 max-w-xl">
      <ToastContainer />

      <PageHeading
        title="Company Settings"
        subtitle="Manage your company information"
      />

      <form onSubmit={handleSubmit}>
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

        <DropdownFeild
          label="Country"
          value={country}
          onChange={handleCountryChange}
          options={countryOptions}
          searchable={true}
        />

        <DropdownFeild
          label="Currency"
          value={currency}
          onChange={setCurrency}
          options={currencyOptions}
        />

        <ButtonFeild type="submit" label="Save Changes" />
      </form>
    </div>
  );
}