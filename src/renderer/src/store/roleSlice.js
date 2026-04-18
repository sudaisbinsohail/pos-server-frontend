//embedded db


// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// // ======================================================
// // ASYNC THUNKS
// // ======================================================

// export const createRoleSlice = createAsyncThunk(
//   "role/createRole",
//   async (data) => {
//     const result = await window.api.createRole(data);
//     return result;
//   }
// );

// export const updateRoleSlice = createAsyncThunk(
//   "role/updateRole",
//   async ({ id, data }) => {
//     const result = await window.api.updateRole(id, data);
//     return result;
//   }
// );

// export const deleteRoleSlice = createAsyncThunk(
//   "role/deleteRole",
//   async (id) => {
//     const result = await window.api.deleteRole(id);
//     return result;
//   }
// );

// export const getRoleByIdSlice = createAsyncThunk(
//   "role/getRoleById",
//   async (id) => {
//     const result = await window.api.getRoleById(id);
//     return result;
//   }
// );

// export const getRolesSlice = createAsyncThunk(
//   "role/getRoles",
//   async (filters) => {
//     const result = await window.api.getRoles(filters);
//     return result;
//   }
// );

// export const assignPermissionsSlice = createAsyncThunk(
//   "role/assignPermissions",
//   async ({ roleId, permissionIds }) => {
//     const result = await window.api.assignPermissions(roleId, permissionIds);
//     return result;
//   }
// );

// export const checkPermissionSlice = createAsyncThunk(
//   "role/checkPermission",
//   async ({ userId, permissionSlug }) => {
//     const result = await window.api.checkPermission(userId, permissionSlug);
//     return result;
//   }
// );

// export const getUserPermissionsSlice = createAsyncThunk(
//   "role/getUserPermissions",
//   async (userId) => {
//     const result = await window.api.getUserPermissions(userId);
//     return result;
//   }
// );

// // ======================================================
// // PERMISSION THUNKS
// // ======================================================

// export const getPermissionsGroupedSlice = createAsyncThunk(
//   "role/getPermissionsGrouped",
//   async () => {
//     const result = await window.api.getPermissionsGrouped();
//     return result;
//   }
// );

// // ======================================================
// // SLICE
// // ======================================================

// const roleSlice = createSlice({
//   name: "role",
//   initialState: {
//     list: [],
//     currentRole: null,
//     userPermissions: [],
//     permissionsGrouped: {},
//     loading: false,
//     permissionsLoading: false, // Separate loading state for permissions
//     error: null
//   },
//   reducers: {
//     clearCurrentRole: (state) => {
//       state.currentRole = null;
//     },
//     clearError: (state) => {
//       state.error = null;
//     }
//   },
//   extraReducers: (builder) => {
//     builder
//       // Get Roles
//       .addCase(getRolesSlice.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(getRolesSlice.fulfilled, (state, action) => {
//         state.loading = false;
//         if (action.payload.success) {
//           state.list = action.payload.roles;
//         } else {
//           state.error = action.payload.error;
//         }
//       })
//       .addCase(getRolesSlice.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.error.message;
//       })

//       // Get Role By ID
//       .addCase(getRoleByIdSlice.fulfilled, (state, action) => {
//         if (action.payload.success) {
//           state.currentRole = action.payload.role;
//         }
//       })

//       // Create Role
//       .addCase(createRoleSlice.fulfilled, (state, action) => {
//         if (action.payload.success) {
//           state.list.push(action.payload.role);
//         }
//       })

//       // Update Role
//       .addCase(updateRoleSlice.fulfilled, (state, action) => {
//         if (action.payload.success) {
//           const index = state.list.findIndex(r => r.id === action.payload.role.id);
//           if (index !== -1) {
//             state.list[index] = action.payload.role;
//           }
//         }
//       })

//       // Delete Role
//       .addCase(deleteRoleSlice.fulfilled, (state, action) => {
//         if (action.payload.success) {
//           state.list = state.list.filter(r => r.id !== action.meta.arg);
//         }
//       })

//       // Get User Permissions - WITH LOADING STATES
//       .addCase(getUserPermissionsSlice.pending, (state) => {
//         state.permissionsLoading = true;
//       })
//       .addCase(getUserPermissionsSlice.fulfilled, (state, action) => {
//         state.permissionsLoading = false;
//         if (action.payload.success) {
//           state.userPermissions = action.payload.permissions;
//         } else {
//           state.error = action.payload.error;
//         }
//       })
//       .addCase(getUserPermissionsSlice.rejected, (state, action) => {
//         state.permissionsLoading = false;
//         state.error = action.error.message;
//       })

//       // Get Permissions Grouped
//       .addCase(getPermissionsGroupedSlice.fulfilled, (state, action) => {
//         if (action.payload.success) {
//           state.permissionsGrouped = action.payload.permissions;
//         }
//       });
//   }
// });

// export const { clearCurrentRole, clearError } = roleSlice.actions;
// export default roleSlice.reducer;

//server side role


import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";

export const getRolesSlice = createAsyncThunk("role/getRoles", async (filters) => {
  console.log("++++++get slice")
  return api.getRoles(filters)});
export const createRoleSlice = createAsyncThunk("role/createRole", async (data) => api.createRole(data));
export const getRoleByIdSlice = createAsyncThunk("role/getRoleById", async (id) => api.getRoleById(id));
export const updateRoleSlice = createAsyncThunk("role/updateRole", async ({ id, data }) => api.updateRole(id, data));
export const deleteRoleSlice = createAsyncThunk("role/deleteRole", async (id) => api.deleteRole(id));
export const assignPermissionsSlice = createAsyncThunk("role/assignPermissions", async ({ roleId, permissionIds }) => api.assignPermissions(roleId, permissionIds));
export const getUserPermissionsSlice = createAsyncThunk("role/getUserPermissions", async (userId) => api.getUserPermissions(userId));
export const checkPermissionSlice = createAsyncThunk("role/checkPermission", async ({ userId, permissionSlug }) => api.checkPermission(userId, permissionSlug));
export const getPermissionsGroupedSlice = createAsyncThunk("role/getPermissionsGrouped", async () => api.getPermissionsGrouped());

const roleSlice = createSlice({
  name: "role",
  initialState: {
    list: [],
    currentRole: null,
    userPermissions: [],
    permissionsGrouped: {},
    loading: false,
    permissionsLoading: false,
    error: null,
  },
  reducers: {
    clearCurrentRole: (state) => { state.currentRole = null },
    clearError: (state) => { state.error = null },
  },
  extraReducers: (builder) => {
    builder
      // List roles
      .addCase(getRolesSlice.pending, (state) => { state.loading = true })
      .addCase(getRolesSlice.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success) state.list = action.payload.roles;
        else state.error = action.payload.error;
      })
      .addCase(getRolesSlice.rejected, (state, action) => { state.loading = false; state.error = action.error.message })

      // By ID
      .addCase(getRoleByIdSlice.fulfilled, (state, action) => { if (action.payload.success) state.currentRole = action.payload.role })

      // Create
      .addCase(createRoleSlice.fulfilled, (state, action) => { if (action.payload.success) state.list.push(action.payload.role) })

      // Update
      .addCase(updateRoleSlice.fulfilled, (state, action) => {
        if (action.payload.success) {
          const idx = state.list.findIndex(r => r.id === action.payload.role.id);
          if (idx !== -1) state.list[idx] = action.payload.role;
        }
      })

      // Delete
      .addCase(deleteRoleSlice.fulfilled, (state, action) => {
        if (action.payload.success) state.list = state.list.filter(r => r.id !== action.meta.arg);
      })

      // User permissions
      .addCase(getUserPermissionsSlice.pending, (state) => { state.permissionsLoading = true })
      .addCase(getUserPermissionsSlice.fulfilled, (state, action) => {
        state.permissionsLoading = false;
        if (action.payload.success) state.userPermissions = action.payload.permissions;
      })
      .addCase(getUserPermissionsSlice.rejected, (state, action) => { state.permissionsLoading = false; state.error = action.error.message })

      // Grouped permissions
      .addCase(getPermissionsGroupedSlice.fulfilled, (state, action) => {
        if (action.payload.success) state.permissionsGrouped = action.payload.permissions;
      });
  },
});

export const { clearCurrentRole, clearError } = roleSlice.actions;
export default roleSlice.reducer;