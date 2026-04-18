import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import InputFeild from "../components/InputFeild";
import ButtonFeild from "../components/ButtonFeild";
import ObjectDropDownFeild from "../components/ObjectDropDownFeild";
import DialogPopUp from "../components/DialogPopUp";
import TableFeild from "../components/TableFeild";
import PageHeading from "../components/PageHeading";
import DeletePopup from "../components/DeletePopup";
import { PencilIcon, TrashIcon, ComputerDesktopIcon } from "@heroicons/react/24/solid";
import api from "../api";

export default function Terminals() {
  const currentUser = useSelector((state) => state.users.currentUser);

  const [terminals, setTerminals] = useState([]);
  const [stores, setStores] = useState([]);
  const [users, setUsers] = useState([]);

  const [open, setOpen] = useState(false);
  const [openDeletePopup, setOpenDeletePopup] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);

  // Form fields
  const [terminalName, setTerminalName] = useState("");
  const [terminalCode, setTerminalCode] = useState("");
  const [description, setDescription] = useState("");
  const [storeId, setStoreId] = useState("");
  const [assignedUserId, setAssignedUserId] = useState("");
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    const [tRes, sRes, uRes] = await Promise.all([
      api.listTerminals(),
      api.listStores(),
      api.listUsers()
    ]);
    if (tRes.success) setTerminals(tRes.terminals);
    if (sRes.success) setStores(sRes.stores);
    if (uRes.success) setUsers(uRes.users);
  };

  const generateCode = () => {
    const ts = Date.now().toString(36).toUpperCase();
    setTerminalCode(`POS-${ts}`);
  };

  const resetForm = () => {
    setTerminalName(""); setTerminalCode(""); setDescription("");
    setStoreId(""); setAssignedUserId(""); setIsActive(true);
    setEditItem(null); setOpen(false);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!terminalName.trim()) return toast.error("Terminal name is required");
    if (!storeId) return toast.error("Please select a store");
    if (!terminalCode.trim()) return toast.error("Terminal code is required");

    const res = await api.createTerminal({
      name: terminalName,
      terminal_code: terminalCode,
      description: description || null,
      store_id: storeId,
      assigned_user_id: assignedUserId || null,
      is_active: isActive,
      user_id: currentUser.id
    });

    if (res.success) {
      toast.success("Terminal created successfully");
      resetForm();
      loadAll();
    } else toast.error(res.error || "Failed to create terminal");
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const res = await api.updateTerminal(editItem.id, {
      name: terminalName,
      terminal_code: terminalCode,
      description: description || null,
      store_id: storeId,
      assigned_user_id: assignedUserId || null,
      is_active: isActive
    });

    if (res.success) {
      toast.success("Terminal updated successfully");
      resetForm();
      loadAll();
    } else toast.error(res.error || "Failed to update terminal");
  };

  const handleDelete = async () => {
    const res = await api.deleteTerminal(deleteItem.id);
    if (res.success) {
      toast.success("Terminal deleted");
      loadAll();
      setOpenDeletePopup(false);
    } else toast.error(res.error);
  };

  const storeOptions = stores.map((s) => ({ label: `${s.name}${s.code ? ` (${s.code})` : ""}`, value: s.id }));
  const userOptions = [
    { label: "— Unassigned —", value: "" },
    ...users.map((u) => ({ label: u.name, value: u.id }))
  ];

  const getStoreName = (storeId) => stores.find((s) => s.id === storeId)?.name || "—";
  const getUserName = (uid) => users.find((u) => u.id === uid)?.name || "—";

  const columns = [
    {
      label: "Terminal", accessor: "name",
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
            <ComputerDesktopIcon className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="font-semibold">{row.name}</p>
            <p className="text-xs font-mono text-gray-500">{row.terminal_code}</p>
          </div>
        </div>
      )
    },
    { label: "Store", accessor: "store_id", render: (r) => getStoreName(r.store_id) },
    { label: "Assigned To", accessor: "assigned_user_id", render: (r) => r.assigned_user_id ? getUserName(r.assigned_user_id) : <span className="text-gray-400 text-xs">Unassigned</span> },
    { label: "Description", accessor: "description", render: (r) => r.description || "—" },
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
        setTerminalName(row.name);
        setTerminalCode(row.terminal_code);
        setDescription(row.description || "");
        setStoreId(row.store_id);
        setAssignedUserId(row.assigned_user_id || "");
        setIsActive(row.is_active);
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
        <PageHeading title="Terminals" subtitle="Manage POS terminals across your stores" />
        <ButtonFeild onClick={() => setOpen(true)} label="Add Terminal" className="w-auto px-4 py-2" />
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
            title={editItem ? "Update Terminal" : "Register New Terminal"}
            subtitle="Assign a terminal to a store"
          />

          <div className="grid grid-cols-2 gap-4">
            <InputFeild
              label="Terminal Name *"
              value={terminalName}
              onChange={(e) => setTerminalName(e.target.value)}
              placeholder="e.g. Counter 1, POS-A"
              required
            />
            <div>
              <InputFeild
                label="Terminal Code *"
                value={terminalCode}
                onChange={(e) => setTerminalCode(e.target.value)}
                placeholder="Unique device ID"
                required
              />
              <button
                type="button"
                onClick={generateCode}
                className="text-xs text-blue-600 hover:underline mt-1"
              >
                Auto-generate code
              </button>
            </div>
          </div>

          <ObjectDropDownFeild
            label="Assign to Store *"
            value={storeId}
            onChange={setStoreId}
            options={storeOptions}
            required
          />

          <ObjectDropDownFeild
            label="Assign to User (Cashier)"
            value={assignedUserId}
            onChange={setAssignedUserId}
            options={userOptions}
          />

          <InputFeild
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional notes about this terminal"
          />

          <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
            <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="w-4 h-4" />
            Active
          </label>

          <ButtonFeild label={editItem ? "Update Terminal" : "Register Terminal"} type="submit" />
        </form>
      </DialogPopUp>

      <div className="flex-1 overflow-auto bg-white rounded-xl shadow-sm">
        <TableFeild columns={columns} data={terminals} actions={actions} />
      </div>
    </div>
  );
}