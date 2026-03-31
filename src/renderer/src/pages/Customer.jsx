import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { getCountries } from "node-countries";
import InputFeild from "../components/InputFeild";
import ButtonFeild from "../components/ButtonFeild";
import DropdownFeild from "../components/DropdownFeild";
import DialogPopUp from "../components/DialogPopUp";
import TableFeild from "../components/TableFeild";
import PageHeading from "../components/PageHeading";
import DeletePopup from "../components/DeletePopup";
import { PencilIcon, TrashIcon, EyeIcon } from "@heroicons/react/24/solid";
import {
  createCustomerSlice,
  getCustomersSlice,
  updateCustomerSlice,
  deleteCustomerSlice,
} from "../store/customerSlice";

const countriesData = getCountries();

export default function CustomerManagement() {
  const dispatch = useDispatch();
  const customers = useSelector((state) => state.customer.list);
  const currentUser = useSelector((state) => state.users.currentUser);

  const [open, setOpen] = useState(false);
  const [openDeletePopup, setOpenDeletePopup] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);

  // Search & Filter
  const [searchBarValue, setSearchBarValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Customer Fields
  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [country, setCountry] = useState("");
  const [stateField, setStateField] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [taxId, setTaxId] = useState("");
  const [creditLimit, setCreditLimit] = useState("");
  const [balance, setBalance] = useState(0);
  const [status, setStatus] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const countryOptions = countriesData.map((c) => c.name);
  const selectedCountry = countriesData.find((c) => c.name === country);
  const stateOptions = selectedCountry?.provinces?.map((s) => s.name) || [];

  const handleCountryChange = (value) => {
    setCountry(value);
    setStateField("");
  };

  useEffect(() => {
    dispatch(getCustomersSlice({ search: searchBarValue, status: statusFilter }));
  }, [dispatch, searchBarValue, statusFilter]);

  const pickImage = async () => {
    const filePath = await window.api.selectImageFile();
    if (filePath) {
      setImageFile(filePath);
      const base64 = await window.api.readImageBase64(filePath);
      setImagePreview(base64);
    }
  };

  const resetForm = () => {
    setCustomerName("");
    setEmail("");
    setPhone("");
    setMobile("");
    setAddress("");
    setCountry("");
    setStateField("");
    setCity("");
    setZipCode("");
    setTaxId("");
    setCreditLimit("");
    setBalance(0);
    setStatus(true);
    setImageFile(null);
    setImagePreview(null);
    setEditItem(null);
    setOpen(false);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!customerName.trim()) return toast.error("Customer name is required");

    let user = await window.api.getUserSession();

    const payload = {
      customerName,
      email,
      phone,
      mobile,
      address,
      country,
      state: stateField,
      city,
      zipCode,
      taxId,
      creditLimit: parseFloat(creditLimit) || 0,
      balance: parseFloat(balance) || 0,
      status,
      image: imageFile,
      user_id: currentUser.id,
    };

    const result = await dispatch(createCustomerSlice(payload)).unwrap();

    if (result.success) {
      toast.success("Customer created successfully");
      resetForm();
      dispatch(getCustomersSlice({ search: searchBarValue, status: statusFilter }));
    } else toast.error(result.error);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const payload = {
      customerName,
      email,
      phone,
      mobile,
      address,
      country,
      state: stateField,
      city,
      zipCode,
      taxId,
      creditLimit: parseFloat(creditLimit) || 0,
      balance: parseFloat(balance) || 0,
      status,
      image: imageFile,
    };

    const result = await dispatch(
      updateCustomerSlice({ id: editItem.id, data: payload })
    ).unwrap();

    if (result.success) {
      toast.success("Customer updated");
      resetForm();
      dispatch(getCustomersSlice({ search: searchBarValue, status: statusFilter }));
    } else toast.error(result.error);
  };

  const handleDelete = async () => {
    const result = await dispatch(deleteCustomerSlice(deleteItem.id)).unwrap();

    if (result.success) {
      toast.success("Customer deleted");
      dispatch(getCustomersSlice({ search: searchBarValue, status: statusFilter }));
      setOpenDeletePopup(false);
    } else toast.error(result.error);
  };

  const columns = [
    { label: "Name", accessor: "customerName" },
    { label: "Email", accessor: "email" },
    { label: "Mobile", accessor: "mobile" },
    { label: "City", accessor: "city" },
    { label: "Balance", accessor: "balance", render: (r) => `$${parseFloat(r.balance || 0).toFixed(2)}` },
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
        setCustomerName(row.customerName);
        setEmail(row.email);
        setPhone(row.phone);
        setMobile(row.mobile);
        setAddress(row.address);
        setCountry(row.country);
        setStateField(row.state);
        setCity(row.city);
        setZipCode(row.zipCode);
        setTaxId(row.taxId);
        setCreditLimit(row.creditLimit);
        setBalance(row.balance);
        setStatus(row.status);

        if (row.imageUrl) {
          const base64 = await window.api.readImageBase64(row.imageUrl);
          setImagePreview(base64);
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
  ];

  return (
    <div className="h-screen overflow-hidden flex flex-col p-6 gap-4">
      <ToastContainer />

      <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <PageHeading title="Customers" subtitle="Manage your customers" className="w-full" />
        </div>

        <div className="flex justify-between items-center gap-4">
          <InputFeild
            label="Search Customers"
            placeholder="Search by name, email, or mobile"
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
            label="Add Customer"
            className="w-auto px-4 py-2"
          />
        </div>
      </div>

      <DeletePopup
        open={openDeletePopup}
        itemName={deleteItem?.customerName}
        onConfirm={handleDelete}
        onClose={() => setOpenDeletePopup(false)}
      />

      <DialogPopUp isOpen={open} onClose={resetForm} className="w-full">
        <form onSubmit={editItem ? handleUpdate : handleCreate} className="w-full flex flex-col gap-3">
          <div className="flex gap-4">
            <div className="w-1/3">
              <label className="block mb-2 font-semibold">Customer Image</label>
              <div
                className="cursor-pointer border-2 border-dashed border-gray-400 rounded-lg flex flex-col items-center justify-center py-6 px-4 hover:border-gray-600 transition"
                onClick={pickImage}
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded" />
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="mt-2 text-gray-500 text-sm">Click to upload</span>
                  </>
                )}
              </div>
            </div>

            <div className="w-2/3 grid grid-cols-2 gap-3">
              <InputFeild label="Customer Name *" value={customerName} onChange={(e) => setCustomerName(e.target.value)} required />
              <InputFeild label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <InputFeild label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
              <InputFeild label="Mobile *" value={mobile} onChange={(e) => setMobile(e.target.value)} required />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <DropdownFeild label="Country" value={country} onChange={handleCountryChange} options={countryOptions} searchable={true} />
            <DropdownFeild label="State" value={stateField} onChange={setStateField} options={stateOptions} searchable={true} allowCustom={true} />
            <InputFeild label="City" value={city} onChange={(e) => setCity(e.target.value)} />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <InputFeild label="Zip Code" value={zipCode} onChange={(e) => setZipCode(e.target.value)} />
            <InputFeild label="Tax ID" value={taxId} onChange={(e) => setTaxId(e.target.value)} />
            <InputFeild label="Credit Limit" type="number" value={creditLimit} onChange={(e) => setCreditLimit(e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <DropdownFeild label="Status" value={status ? "Active" : "Disabled"} onChange={(v) => setStatus(v === "Active")} options={["Active", "Disabled"]} />
            <InputFeild label="Opening Balance" type="number" value={balance} onChange={(e) => setBalance(e.target.value)} />
          </div>

          <InputFeild label="Address" value={address} onChange={(e) => setAddress(e.target.value)} />

          <ButtonFeild label={editItem ? "Update Customer" : "Create Customer"} type="submit" />
        </form>
      </DialogPopUp>

      <TableFeild columns={columns} data={customers} actions={actions} />
    </div>
  );
}