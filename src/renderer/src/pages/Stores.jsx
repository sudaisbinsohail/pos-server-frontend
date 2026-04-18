import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import InputFeild from "../components/InputFeild";
import ButtonFeild from "../components/ButtonFeild";
import DropdownFeild from "../components/DropdownFeild";
import DialogPopUp from "../components/DialogPopUp";
import TableFeild from "../components/TableFeild";
import PageHeading from "../components/PageHeading";
import DeletePopup from "../components/DeletePopup";
import { PencilIcon, TrashIcon, EyeIcon, BuildingStorefrontIcon } from "@heroicons/react/24/solid";
import api from "../api";

export default function Stores() {
  const currentUser = useSelector((state) => state.users.currentUser);

  const [stores, setStores] = useState([]);
  const [open, setOpen] = useState(false);
  const [openDeletePopup, setOpenDeletePopup] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);

  // Form fields
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [isMain, setIsMain] = useState(false);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    loadStores();
  }, []);

  const loadStores = async () => {
    const res = await api.listStores();
    if (res.success) setStores(res.stores);
    else toast.error(res.error || "Failed to load stores");
  };

  const resetForm = () => {
    setName(""); setCode(""); setAddress(""); setPhone("");
    setEmail(""); setCity(""); setState(""); setCountry("");
    setIsMain(false); setIsActive(true);
    setEditItem(null); setOpen(false);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Store name is required");

    const res = await api.createStore({
      name, code: code || null, address: address || null,
      phone: phone || null, email: email || null,
      city: city || null, state: state || null, country: country || null,
      is_main: isMain, is_active: isActive,
      user_id: currentUser.id
    });

    if (res.success) {
      toast.success("Store created successfully");
      resetForm();
      loadStores();
    } else toast.error(res.error || "Failed to create store");
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const res = await api.updateStore(editItem.id, {
      name, code: code || null, address: address || null,
      phone: phone || null, email: email || null,
      city: city || null, state: state || null, country: country || null,
      is_main: isMain, is_active: isActive
    });

    if (res.success) {
      toast.success("Store updated successfully");
      resetForm();
      loadStores();
    } else toast.error(res.error || "Failed to update store");
  };

  const handleDelete = async () => {
    const res = await api.deleteStore(deleteItem.id);
    if (res.success) {
      toast.success("Store deleted");
      loadStores();
      setOpenDeletePopup(false);
    } else toast.error(res.error);
  };

  const columns = [
    {
      label: "Store", accessor: "name",
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-dark rounded-lg flex items-center justify-center">
            <BuildingStorefrontIcon className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="font-semibold">{row.name}</p>
            <p className="text-xs text-gray-500">{row.code || "—"}</p>
          </div>
        </div>
      )
    },
    { label: "City", accessor: "city", render: (r) => r.city || "—" },
    { label: "Phone", accessor: "phone", render: (r) => r.phone || "—" },
    {
      label: "Main Branch", accessor: "is_main",
      render: (r) => r.is_main
        ? <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded font-medium">HQ</span>
        : <span className="text-gray-400 text-xs">Branch</span>
    },
    {
      label: "Status", accessor: "is_active",
      render: (r) => r.is_active
        ? <span className="px-2 py-1 bg-green-100 text-green-600 text-xs rounded">Active</span>
        : <span className="px-2 py-1 bg-red-100 text-red-600 text-xs rounded">Inactive</span>
    },
  ];

  const actions = [
    {
      label: "Edit", icon: PencilIcon,
      className: "bg-primary-dark text-white hover:bg-blue-600 rounded-md",
      onClick: (row) => {
        setEditItem(row);
        setName(row.name); setCode(row.code || "");
        setAddress(row.address || ""); setPhone(row.phone || "");
        setEmail(row.email || ""); setCity(row.city || "");
        setState(row.state || ""); setCountry(row.country || "");
        setIsMain(row.is_main); setIsActive(row.is_active);
        setOpen(true);
      }
    },
    {
      label: "Delete", icon: TrashIcon,
      className: "bg-red-500 text-white hover:bg-red-600 rounded-md",
      onClick: (row) => { setDeleteItem(row); setOpenDeletePopup(true); }
    }
  ];

  return (
    <div className="h-screen overflow-hidden flex flex-col p-6 gap-4">
      <ToastContainer position="top-center" autoClose={1500} />

      <div className="bg-white p-6 rounded-xl shadow-sm flex justify-between items-center">
        <PageHeading title="Stores" subtitle="Manage your business locations" />
        <ButtonFeild onClick={() => setOpen(true)} label="Add Store" className="w-auto px-4 py-2" />
      </div>

      <DeletePopup
        open={openDeletePopup}
        itemName={deleteItem?.name}
        onConfirm={handleDelete}
        onClose={() => setOpenDeletePopup(false)}
      />

      <DialogPopUp isOpen={open} onClose={resetForm} className="w-full max-w-2xl">
        <form onSubmit={editItem ? handleUpdate : handleCreate} className="space-y-4">
          <PageHeading
            title={editItem ? "Update Store" : "Create New Store"}
            subtitle="Fill in the store details"
          />

          <div className="grid grid-cols-2 gap-4">
            <InputFeild label="Store Name *" value={name} onChange={(e) => setName(e.target.value)} required />
            <InputFeild label="Store Code" value={code} onChange={(e) => setCode(e.target.value)} placeholder="e.g. STR-01" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <InputFeild label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
            <InputFeild label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <InputFeild label="City" value={city} onChange={(e) => setCity(e.target.value)} />
            <InputFeild label="State" value={state} onChange={(e) => setState(e.target.value)} />
            <InputFeild label="Country" value={country} onChange={(e) => setCountry(e.target.value)} />
          </div>
          <InputFeild label="Address" value={address} onChange={(e) => setAddress(e.target.value)} />

          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
              <input type="checkbox" checked={isMain} onChange={(e) => setIsMain(e.target.checked)} className="w-4 h-4" />
              Main Branch / HQ
            </label>
            <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
              <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="w-4 h-4" />
              Active
            </label>
          </div>

          <ButtonFeild label={editItem ? "Update Store" : "Create Store"} type="submit" />
        </form>
      </DialogPopUp>

      <div className="flex-1 overflow-auto bg-white rounded-xl shadow-sm">
        <TableFeild columns={columns} data={stores} actions={actions} />
      </div>
    </div>
  );
}