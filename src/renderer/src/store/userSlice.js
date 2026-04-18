

//local user creation


// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


// export const loadUsers = createAsyncThunk("users/loadUsers", async (filter) => {
//   const result = await window.api.listUsers(filter);
//   return result.success ? result.users : [];
// });

// export const createUser = createAsyncThunk("users/createUser", async (newUser) => {
//   const result = await window.api.createUser(newUser);
//   return result; // { success, error }
// });

// export const updateUser = createAsyncThunk("users/updateUser", async ({id, data}) => {
//   const result = await window.api.updateUser(id, data);
//   return result; // { success, error }
// });

// export const deleteUser = createAsyncThunk("users/deleteUser", async (userId) => {
//   const result = await window.api.softDeleteUser(userId);
//   console.log("Delete User Result:", result);
//   return result; // { success, error }
// });




// // -----------------------------
// // SLICE
// // -----------------------------
// const userSlice = createSlice({
//   name: "users",
//   initialState: {
//     list: [],
//     loading: false,
//     error: null,
//   },
//   reducers: {},

//   extraReducers: (builder) => {
//     builder

//       // Load Users
//       .addCase(loadUsers.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(loadUsers.fulfilled, (state, action) => {
//         state.list = action.payload;
//         state.loading = false;
//       })
//       // Create User
//       .addCase(createUser.fulfilled, (state, action) => {
//         if (action.payload.success) {
//           // refresh list manually because electron returns no object
//         } else {
//           state.error = action.payload.error;
//         }
//       })

//         // Update User  
//         .addCase(updateUser.fulfilled, (state, action) => {
//             if (action.payload.success) {
//                 // refresh list manually because electron returns no object
//             } else {
//                 state.error = action.payload.error;
//             }       
//         })


//         //delete user
//         .addCase(deleteUser.fulfilled, (state, action) => {
//             if (action.payload.success) {
//                 // refresh list manually because electron returns no object
//             } else {
//                 state.error = action.payload.error;
//             }
//         });






//   },
// });

// export default userSlice.reducer;




/// server user creation


import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api, { setToken, removeToken } from "../api";

// ─────────────────────────────────────────────
// LOGIN  (replaces authUser + userSession)
// ─────────────────────────────────────────────
export const loginUser = createAsyncThunk("users/loginUser", async ({ email, password }) => {
  const result = await api.login(email, password);
  if (result.success) setToken(result.token);
  return result;
});

// ─────────────────────────────────────────────
// LOGOUT  (replaces removeUserSession)
// ─────────────────────────────────────────────
export const logoutUser = createAsyncThunk("users/logoutUser", async () => {
  removeToken();
  return { success: true };
});

// ─────────────────────────────────────────────
// GET PROFILE  (replaces getUserSession)
// ─────────────────────────────────────────────
export const getProfile = createAsyncThunk("users/getProfile", async () => {
  return await api.getProfile();
});

// ─────────────────────────────────────────────
// CHANGE PASSWORD
// ─────────────────────────────────────────────
export const changePassword = createAsyncThunk("users/changePassword", async (data) => {
  return await api.changePassword(data);
});

// ─────────────────────────────────────────────
// CHECK ADMIN EXISTS
// ─────────────────────────────────────────────
export const checkAdminExists = createAsyncThunk("users/checkAdminExists", async () => {
  return await api.checkAdmin();
});

// ─────────────────────────────────────────────
// LIST USERS
// ─────────────────────────────────────────────
export const loadUsers = createAsyncThunk("users/loadUsers", async (filters) => {
  const result = await api.listUsers(filters);
  return result.success ? result.users : [];
});

// ─────────────────────────────────────────────
// CREATE USER
// ─────────────────────────────────────────────
export const createUser = createAsyncThunk("users/createUser", async (data) => {
  return await api.createUser(data);
});

// ─────────────────────────────────────────────
// UPDATE USER
// ─────────────────────────────────────────────
export const updateUser = createAsyncThunk("users/updateUser", async ({ id, data }) => {
  return await api.updateUser(id, data);
});

// ─────────────────────────────────────────────
// DELETE USER
// ─────────────────────────────────────────────
export const deleteUser = createAsyncThunk("users/deleteUser", async (id) => {
  return await api.softDeleteUser(id);
});

// ─────────────────────────────────────────────
// SLICE
// ─────────────────────────────────────────────
const userSlice = createSlice({
  name: "users",
  initialState: {
    list: [],
    currentUser: null,   // logged-in user profile
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => { state.error = null },
  },
  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(loginUser.pending, (state) => { state.loading = true; state.error = null })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success) {
          state.currentUser = action.payload.user;
        } else {
          state.error = action.payload.error;
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // LOGOUT
      .addCase(logoutUser.fulfilled, (state) => {
        state.currentUser = null;
      })

      // GET PROFILE
      .addCase(getProfile.fulfilled, (state, action) => {
        if (action.payload.success) state.currentUser = action.payload.user;
      })

      // LOAD USERS
      .addCase(loadUsers.pending, (state) => { state.loading = true })
      .addCase(loadUsers.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading = false;
      })

      // CREATE USER
      .addCase(createUser.fulfilled, (state, action) => {
        if (!action.payload.success) state.error = action.payload.error;
      })

      // UPDATE USER
      .addCase(updateUser.fulfilled, (state, action) => {
        if (!action.payload.success) state.error = action.payload.error;
      })

      // DELETE USER
      .addCase(deleteUser.fulfilled, (state, action) => {
        if (!action.payload.success) state.error = action.payload.error;
      });
  },
});

export const { clearError } = userSlice.actions;
export default userSlice.reducer;