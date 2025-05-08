import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserModel } from "../users/models/userModel";
import axios from "axios";
import { fetchData } from "../../global/api";

interface UpdateModel {
  id: string | undefined;
  changes: UserModel;
}

interface AdminsState {
  users: UserModel[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  status: "loading" | "succeeded" | "failed" | "idle";
  error: string | null;
}

const initialState: AdminsState = {
  users: [],
  page: 0,
  size: 0,
  totalElements: 0,
  totalPages: 0,
  status: "idle",
  error: null,
};

export const fetchAdminUsers = createAsyncThunk(
  "fetchAdminUsers",
  async (
    { page, size }: { page: number; size: number },
    { rejectWithValue }
  ) => {
    try {
      const results = await fetchData(`fetch-admin-users/${page}/${size}`);
      if (results.data.status && results.data.status !== "OK") {
        return initialState;
      }

      return results.data;
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("FETCH ADMIN USERS CANCELLED ", error.message);
        return rejectWithValue("Error: Fetch admin users cancelled.");
      }
    }
  }
);

const AdminStaffSlice = createSlice({
  name: "admis",
  initialState,
  reducers: {
    // setting new admins on previos or next fetch
    resetAdmins: {
      reducer(state, action: PayloadAction<AdminsState>) {
        state.users = action.payload.users;
        state.page = action.payload.page;
        state.size = action.payload.size;
        state.totalElements = action.payload.totalElements;
        state.totalPages = action.payload.totalPages;
      },
      prepare(admins: AdminsState) {
        return { payload: admins };
      },
    },

    // admins a new admin user entry
    addAdmin: {
      reducer(state, action: PayloadAction<UserModel>) {
        state.users.push(action.payload);
      },
      prepare(user: UserModel) {
        return { payload: user };
      },
    },

    // deleting admin
    deleteAdmin: {
      reducer(state, action: PayloadAction<number>) {
        state.users = state.users.filter(
          (user) => Number(user.userId) !== Number(action.payload)
        );
      },
      prepare(usersId: number) {
        return { payload: usersId };
      },
    },

    // update admin
    updateAdmin: {
      reducer(state, action: PayloadAction<UpdateModel>) {
        const { id, changes } = action.payload;
        const adminIndex = state.users.findIndex(
          (user) => Number(user.userId) === Number(id)
        );

        if (adminIndex >= 0) {
          state.users[adminIndex] = { ...state.users[adminIndex], ...changes };
        }
      },
      prepare(user: UpdateModel) {
        return { payload: user };
      },
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminUsers.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchAdminUsers.fulfilled,
        (state, action: PayloadAction<AdminsState>) => {
          state.users = action.payload.users;
          state.page = action.payload.page;
          state.size = action.payload.size;
          state.totalElements = action.payload.totalElements;
          state.totalPages = action.payload.totalPages;
          state.status = "succeeded";
          state.error = null;
        }
      )
      .addCase(fetchAdminUsers.rejected, (state, action: any) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const getAdminUsers = (state: { admins: AdminsState }) => state.admins;
export const getAdminUsersById =
  (userId: number) => (state: { admins: AdminsState }) =>
    state.admins.users.find((admin) => Number(admin.userId) === userId);

export const { resetAdmins, addAdmin, deleteAdmin, updateAdmin } =
  AdminStaffSlice.actions;

export default AdminStaffSlice.reducer;
