
import { useState, useEffect } from "react";
import InputFeild from "../components/InputFeild";
import ButtonFeild from "../components/ButtonFeild";
import DropdownFeild from "../components/DropdownFeild";
import { ToastContainer, toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { PencilIcon, TrashIcon, EyeIcon } from "@heroicons/react/24/solid";
import { getCountries } from "node-countries";

import {
  createSupplierSlice,
  deleteSupplierSlice,
  getSupplierSlice,
  updateSupplierSlice,
} from "../store/supplierSlice";


import { getCompanySlice } from "../store/companySlice";

import DialogPopUp from "../components/DialogPopUp";
import PageHeading from "../components/PageHeading";
import DeletePopup from "../components/DeletePopup";
import TableFeild from "../components/TableFeild";
import SupplierView from "../components/SupplierView";

// Load once outside component
const countriesData = getCountries();

export default function Supplier() {
  const dispatch = useDispatch();
  const suppliers = useSelector((state) => state.supplier.list);

  const [open, setOpen] = useState(false);
  const [openDeletePopup, setOpenDeletePopup] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [supplierviewform, setSupplierViewForm] = useState(false);
  const [supplierView, setSupplierView] = useState("");

  // Search & Filter
  const [searchBarValue, setSearchBarValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Supplier Fields
  const [supplierName, setSupplierName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [country, setCountry] = useState("");
  const [stateField, setStateField] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [currency, setCurrency] = useState("PKR");
  const [taxId, setTaxId] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("");
  const [status, setStatus] = useState(true);

  // Image Handling
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // AUTO COUNTRY → STATE → CURRENCY
  const countryOptions = countriesData.map((c) => c.name);
  const selectedCountry = countriesData.find((c) => c.name === country);
  const stateOptions = selectedCountry?.provinces?.map((s) => s.name) || [];
  const autoCurrency = selectedCountry?.currency;

   const currentUser = useSelector((state) => state.users.currentUser);
   
  const [defaultCurrency , setDefaultCurrency] = useState("") ;

  const handleCountryChange = (value) => {
    setCountry(value);
    const found = countriesData.find((c) => c.name === value);
    setCurrency(found?.currencies[0] || defaultCurrency);
    setStateField("");
  };

  // Load suppliers on mount & whenever search/filter changes
  useEffect(() => {
    dispatch(getSupplierSlice({ search: searchBarValue, status: statusFilter }));
  }, [dispatch, searchBarValue, statusFilter]);

  const pickImage = async () => {
    const filePath = await window.api.selectImageFile();
    if (filePath) {
      setImageFile(filePath);
      const base64 = await window.api.readImageBase64(filePath);
      setImagePreview(base64);
    }
  };


// useEffect(() => {
//   async function loadCompany() {
//     try {
//       const user = await window.api.getUserSession();
//       const res = await window.api.getCompany(user.user.company_id);

//       if (res.success) {
//         const company = res.company.dataValues;
//         setDefaultCurrency(company.currency);
//         setCurrency(company.currency); // ⭐ important
//       }
//     } catch (err) {
//       toast.error("Failed to load company currency");
//     }
//   }

//   loadCompany();
// }, []);
const company = useSelector((state) => state.company.company);

// Load company ONCE
useEffect(() => {
  dispatch(getCompanySlice());
}, [dispatch]);

// Set default currency ONLY once when empty
useEffect(() => {
  if (company && !defaultCurrency) {
    setDefaultCurrency(company.currency);
    setCurrency(company.currency);
  }
}, [company, defaultCurrency]);

  const resetForm = () => {
    setSupplierName("");
    setEmail("");
    setPhone("");
    setMobile("");
    setAddress("");
    setCountry("");
    setStateField("");
    setCity("");
    setZipCode("");
    setCurrency("PKR");
    setTaxId("");
    setPaymentTerms("");
    setStatus(true);
    setImageFile(null);
    setImagePreview(null);
    setEditItem(null);
    setOpen(false);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!supplierName.trim()) return toast.error("Supplier name is required");

    // let user = await window.api.getUserSession();
    // let user = useSelector((state)=>state.users.currentUser);

    const payload = {
      supplierName,
      email,
      phone,
      mobile,
      address,
      country,
      state: stateField,
      city,
      zipCode,
      currency,
      taxId,
      paymentTerms,
      status,
      image: imageFile,
      // user_id: user.user.id,
      user_id: currentUser.id,
    };

    const result = await dispatch(createSupplierSlice(payload)).unwrap();

    if (result.success) {
      toast.success("Supplier created successfully");
      resetForm();
      dispatch(getSupplierSlice({ search: searchBarValue, status: statusFilter }));
    } else toast.error(result.error);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const payload = {
      supplierName,
      email,
      phone,
      mobile,
      address,
      country,
      state: stateField,
      city,
      zipCode,
      currency,
      taxId,
      paymentTerms,
      status,
      image: imageFile,
    };

    const result = await dispatch(
      updateSupplierSlice({ id: editItem.id, data: payload })
    ).unwrap();

    if (result.success) {
      toast.success("Supplier updated");
      resetForm();
      dispatch(getSupplierSlice({ search: searchBarValue, status: statusFilter }));
    } else toast.error(result.error);
  };

  const handleDeleteSupplier = async () => {
    const result = await dispatch(deleteSupplierSlice(deleteItem.id)).unwrap();

    if (result.success) {
      toast.success("Supplier deleted");
      dispatch(getSupplierSlice({ search: searchBarValue, status: statusFilter }));
      setOpenDeletePopup(false);
    } else toast.error(result.error);
  };

  const columns = [
    { label: "Name", accessor: "supplierName" },
    { label: "Email", accessor: "email" },
    { label: "Phone", accessor: "phone" },
    { label: "City", accessor: "city" },
    { label: "Country", accessor: "country" },
    { label: "Status", accessor: "status", render: (r) => (r.status ? "Active" : "Disabled") },
  ];

  const actions = [
    {
      label: "Edit",
      icon: PencilIcon,
      className: "bg-primary-dark text-white hover:bg-blue-600 rounded-md",
      onClick: async (row) => {
        setOpen(true);
        setEditItem(row);

        setSupplierName(row.supplierName);
        setEmail(row.email);
        setPhone(row.phone);
        setMobile(row.mobile);
        setAddress(row.address);
        setCountry(row.country);
        setStateField(row.state);
        setCity(row.city);
        setZipCode(row.zipCode);
        setCurrency(row.currency);
        setTaxId(row.taxId);
        setPaymentTerms(row.paymentTerms);
        setStatus(row.status);

        if (row.imageUrl) {
          const base64 = await window.api.readImageBase64(row.imageUrl);
          setImagePreview(base64);
          setImageFile(null);
        }
      },
    },
    {
      label: "Delete",
      icon: TrashIcon,
      className: "bg-red-500 text-white hover:bg-red-600 rounded-md",
      onClick: (row) => {
        setDeleteItem(row);
        setOpenDeletePopup(true);
      },
    },
    {
      label: "View",
      icon: EyeIcon,
      className: "bg-secondary text-white hover:bg-secondary-dark rounded-md",
      onClick: (row) => {
        setSupplierViewForm(true);
        setSupplierView(row);
      },
    },
  ];

  return (
    <div className="h-screen overflow-hidden flex flex-col p-6 gap-4">
      <ToastContainer />
<div>


      <div className=" flex justify-between items-center gap-10">
        <PageHeading title="Suppliers" subtitle="Manage your suppliers" className="w-100" />
        </div>
 <div className=" flex justify-between items-center gap-4">
        {/* Search & Filter */}
        <InputFeild
          label="Search Suppliers"
          placeholder="Search by name, email, or city"
          value={searchBarValue}
          onChange={(e) => setSearchBarValue(e.target.value)}
        />
        <DropdownFeild
          label="Filter by Status"
          value={statusFilter}
          onChange={(val) => setStatusFilter(val)}
          options={["All", "Active", "Disabled"]}
        />

        <ButtonFeild
          onClick={() => setOpen(true)}
          label="Add Supplier"
          className="w-auto  px-4 py-2"
        />
      </div>
</div>
      {/* VIEW POPUP */}
      <DialogPopUp isOpen={supplierviewform} onClose={() => setSupplierViewForm(false)} className="w-2xl">
        <SupplierView supplier={supplierView} />
      </DialogPopUp>

      {/* DELETE POPUP */}
      <DeletePopup
        open={openDeletePopup}
        itemName={deleteItem?.supplierName}
        onConfirm={handleDeleteSupplier}
        onClose={() => setOpenDeletePopup(false)}
      />

      {/* CREATE / UPDATE FORM */}
      <DialogPopUp isOpen={open} onClose={() => resetForm()} className="w-full">
        <form onSubmit={editItem ? handleUpdate : handleCreate} className="w-full flex flex-col gap-3">
          {/* IMAGE + BASIC INFO */}
          <div className="flex gap-4">
            <div className="w-full md:w-1/3">
              <label className="block mb-2 font-semibold">Supplier Image</label>
              <div
                className="cursor-pointer border-2 border-dashed border-gray-400 rounded-lg flex flex-col items-center justify-center py-6 px-4 hover:border-gray-600 transition"
                onClick={pickImage}
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded" />
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-15 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h10a4 4 0 004-4V9a4 4 0 00-4-4H7a4 4 0 00-4 4v6z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10l4 4 4-4" />
                    </svg>
                    <span className="mt-2 text-gray-500 text-sm">Click to upload</span>
                  </>
                )}
              </div>
            </div>

            <div className="w-2/3 grid grid-cols-2 gap-3">
              <InputFeild label="Supplier Name" value={supplierName} onChange={(e) => setSupplierName(e.target.value)} required />
              <InputFeild label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <InputFeild label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
              <InputFeild label="Mobile" value={mobile} onChange={(e) => setMobile(e.target.value)} />
            </div>
          </div>

          {/* COUNTRY / STATE / CITY */}
          <div className="grid grid-cols-3 gap-4">
            <DropdownFeild label="Country" value={country} onChange={handleCountryChange} options={countryOptions} searchable={true} />
            <DropdownFeild label="State" value={stateField} onChange={setStateField} options={stateOptions} searchable={true} allowCustom={true} />
            <InputFeild label="City" value={city} onChange={(e) => setCity(e.target.value)} />
          </div>

          {/* CURRENCY + ZIP + TAX ID */}
          <div className="grid grid-cols-3 gap-4">
            <DropdownFeild label="Currency" value={currency} onChange={setCurrency} options={[autoCurrency]} />
            <InputFeild label="Zip Code" value={zipCode} onChange={(e) => setZipCode(e.target.value)} />
            <InputFeild label="Tax ID" value={taxId} onChange={(e) => setTaxId(e.target.value)} />
          </div>

          {/* STATUS + PAYMENT TERMS */}
          <div className="grid grid-cols-2 gap-4">
            <DropdownFeild label="Status" value={status ? "Active" : "Disabled"} onChange={(v) => setStatus(v === "Active")} options={["Active", "Disabled"]} />
            <InputFeild label="Payment Terms" value={paymentTerms} onChange={(e) => setPaymentTerms(e.target.value)} />
          </div>

          {/* ADDRESS */}
          <InputFeild label="Address" value={address} onChange={(e) => setAddress(e.target.value)} />

          {/* SUBMIT BUTTON */}
          <ButtonFeild label={editItem ? "Update Supplier" : "Create Supplier"} type="submit" />
        </form>
      </DialogPopUp>

      {/* TABLE */}
      <TableFeild columns={columns} data={suppliers} actions={actions} />
    </div>
  );
}
