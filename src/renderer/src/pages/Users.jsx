
import React, { useState, useEffect, use } from "react";
import InputField from "../components/InputFeild";
import ButtonFeild from "../components/ButtonFeild";
import PageHeading from "../components/PageHeading";
import DropdownFeild from "../components/DropdownFeild";
import ObjectDropDownFeild from "../components/ObjectDropDownFeild";
import { ToastContainer, toast } from "react-toastify";
import DialogPopUp from "../components/DialogPopUp";
import TableFeild from "../components/TableFeild";
import { useSelector, useDispatch } from "react-redux";
import { loadUsers, createUser, updateUser, deleteUser } from "../store/userSlice";
import { getRolesSlice , getRoleByIdSlice } from "../store/roleSlice";

import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";

export default function Users() {
  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roleId, setRoleId] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [searchBar, setSearchBar] = useState("");
  const [open, setOpen] = useState(false);
  const [editUserId, setEditUserId] = useState(null);

  const users = useSelector((state) => state.users.list);
  const roles = useSelector((state) => state.role.list);

  const dispatch = useDispatch();

  // Table columns
  const columns = [
    { label: "ID", accessor: "id" },
    { label: "Name", accessor: "name" },
    { label: "Email", accessor: "email" },
    {
  label: "Role",
  accessor: "roleName",
  render: (row) => {
    const role = roles.find(r => r.id === row.role_id);

    return (
      <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-600">
        {role?.display_name || "Unknown"}
      </span>
    );
  }
},
    {
      label: "Status",
      accessor: "is_active",
      render: (row) => (
        <span className={`px-2 py-1 rounded text-xs ${
          row.is_active 
            ? 'bg-green-100 text-green-600' 
            : 'bg-red-100 text-red-600'
        }`}>
          {row.is_active ? 'Active' : 'Inactive'}
        </span>
      )
    }
  ];

  useEffect(() => {
    dispatch(loadUsers({ search: "", role: "All" }));
    dispatch(getRolesSlice({ search: "" }));
  
  }, [dispatch]);
 

  // Create user
  const handleCreateUser = async (e) => {
    e.preventDefault();
    
    if (!roleId) {
      toast.error("Please select a role");
      return;
    }

    const result = await dispatch(
      createUser({ 
        name, 
        email, 
        password, 
        role_id: parseInt(roleId) 
      })
    ).unwrap();
    
    setEditUserId(null);
    setEmail("");
    setName("");
    setPassword("");
    setRoleId("");
    setOpen(false);

    if (result.success) {
      toast.success("User created!");
      dispatch(loadUsers({ search: searchBar, role: filterRole }));
    } else {
      toast.error(result.error);
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    
    const data = { 
      name, 
      email, 
      role_id: parseInt(roleId)
    };
    
    if (password) {
      data.password_hash = password;
    }
    
    const result = await dispatch(updateUser({ id: editUserId, data })).unwrap();

    setEditUserId(null);
    setEmail("");
    setName("");
    setPassword("");
    setRoleId("");
    setOpen(false);

    if (result.success) {
      toast.success("User updated!");
      dispatch(loadUsers({ search: searchBar, role: filterRole }));
    } else {
      toast.error(result.error);
    }
  };

  const actions = [
    {
      label: "Edit",
      icon: PencilIcon,
      className: "bg-primary-dark text-white hover:bg-blue-600 rounded-md",
      onClick: (row) => {
        setOpen(true);
        setEmail(row.email);
        setName(row.name);
        setRoleId(row.role_id);
        setEditUserId(row.id);
      },
    },
    {
      label: "Delete",
      icon: TrashIcon,
      className: "bg-red-500 text-white hover:bg-red-600 rounded-md",
      onClick: (row) => {
        dispatch(deleteUser(row.id)).then((result) => {
          if (result.payload.success) {
            toast.success("User deleted!");
            dispatch(loadUsers({ search: searchBar, role: filterRole }));
          } else {
            toast.error(result.payload.error);
          }
        });
      },
    },
  ];

  // Create role options for dropdown
  const roleOptions = roles.map(role => ({
    label: role.name,
    value: role.id
  }));

  return (
    <div className="h-screen overflow-hidden flex flex-col">
      <DialogPopUp
        isOpen={open}
        title=""
        onClose={() => {
          setOpen(false);
          setEditUserId(null);
          setName("");
          setEmail("");
          setPassword("");
          setRoleId("");
        }}
      >
        <PageHeading 
          title={editUserId ? "Update User" : "Add New User"}
          subtitle="Create users to manage your POS system" 
        />

        <form
          className="gap-5 w-full mb-10"
          onSubmit={editUserId ? handleUpdateUser : handleCreateUser}
        >
          <div className="w-full">
            <InputField
              label="Name"
              value={name}
              placeholder="Enter User Name"
              onChange={(e) => setName(e.target.value)}
              required
            />

            <InputField
              label="Email"
              value={email}
              placeholder="Enter User Email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="w-full">
            <InputField
              label="Password"
              type="password"
              value={password}
              placeholder={editUserId ? "Leave blank to keep current password" : "Enter User Password"}
              onChange={(e) => setPassword(e.target.value)}
              required={!editUserId}
            />

            <ObjectDropDownFeild
              label="Select Role *"
              value={roleId}
              onChange={setRoleId}
              options={roleOptions}
              placeholder="Choose role"
              required
            />
          </div>

          <ButtonFeild 
            className="h-11 mt-8" 
            type="submit" 
            label={editUserId ? "Update User" : "Add User"} 
          />
        </form>
      </DialogPopUp>
      
      <ToastContainer />

      <div className="bg-white p-6 rounded-xl shadow-sm">
        <PageHeading title="Users List" subtitle="Manage your system users" />

        <div className="flex gap-4 mt-5 md:flex-row md:items-center md:justify-between">
          <InputField
            label="Search Users"
            placeholder="Search by name or email"
            value={searchBar}
            onChange={(e) => {
              const value = e.target.value;
              setSearchBar(value);
              dispatch(loadUsers({ search: value, role: filterRole }));
            }}
          />
          
          <DropdownFeild
            label="Filter by Role"
            value={filterRole}
            onChange={(role) => {
              setFilterRole(role);
              dispatch(loadUsers({ search: searchBar, role }));
            }}
            options={["All", ...roles.map(r => r.name)]}
            placeholder="Select role"
          />
          
          <ButtonFeild 
            onClick={() => setOpen(true)} 
            label="Add User" 
          />
        </div>

        <div>
          <TableFeild columns={columns} data={users} actions={actions} />
        </div>
      </div>
    </div>
  );
}