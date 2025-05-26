// usersSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserModel } from "./models/userModel";
import { fetchData } from "../../global/api";
import axios from "axios";

// updateModel
interface UpdateModel {
  id: string | undefined;
  changes: UserModel;
}

// users state type
interface UsersState {
  users: UserModel[];
  size: number;
  page: number;
  totalElements: number;
  totalPages: number;
  status: string;
  error: string | null;
}

// initial users state
const initialState: UsersState = {
  users: [],
  size: 25,
  page: 0,
  totalElements: 0,
  totalPages: 0,
  status: "idle",
  error: null,
};

// async thunk for fetching users
export const fetchUsers = createAsyncThunk(
  "/fetchUsers",
  async ({ page, size }: { page: number; size: number }) => {
    try {
      const result = await fetchData(`/fetch-users/${page}/${size}`);

      if (!result) return initialState;

      if (
        (result.data.status && result.data.status !== "OK") ||
        result.status !== 200
      ) {
        return initialState;
      }
      return result.data;
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("FETCH USERS CANCELLED ", error.message);
      }
    }
  }
);

// create users slice
const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    //set user status
    setUsersStatus: {
      reducer(state, action: PayloadAction<string>) {
        state.status = action.payload;
      },

      prepare(status: string) {
        return { payload: status };
      },
    },

    // resting users on each fetch
    resetUsers: {
      reducer(state, action: PayloadAction<UsersState>) {
        state.users = action.payload.users;
        state.page = action.payload.page;
        state.size = action.payload.size;
        state.totalElements = action.payload.totalElements;
        state.totalPages = action.payload.totalPages;
        state.status = "succeded";
        state.error = null;
      },

      prepare(users: UsersState) {
        return { payload: users };
      },
    },

    // adding a new user
    addUser: {
      reducer(state, action: PayloadAction<UserModel>) {
        state.users = [action.payload, ...state.users];
      },
      prepare(user: UserModel) {
        return {
          payload: user,
        };
      },
    },

    // update a user
    updateUser: {
      reducer(state, action: PayloadAction<UpdateModel>) {
        const { id, changes } = action.payload;
        const userIndex = state.users.findIndex(
          (user) => Number(user.userId) === Number(id)
        );
        if (userIndex >= 0) {
          state.users[userIndex] = { ...state.users[userIndex], ...changes };
        }
      },

      prepare(user: UpdateModel) {
        return { payload: user };
      },
    },

    // update user status
    updateStatus: {
      reducer(
        state,
        action: PayloadAction<{ userId: number; userStatus: string }>
      ) {
        const { userId, userStatus } = action.payload;
        const userIndex = state.users.findIndex(
          (user) => Number(user.userId) === Number(userId)
        );
        if (userIndex >= 0) {
          state.users[userIndex] = {
            ...state.users[userIndex],
            userStatus: userStatus,
          };
        }
      },

      prepare(statusChange: { userId: number; userStatus: string }) {
        return { payload: statusChange };
      },
    },

    // delete user
    deleteUser: {
      reducer(state, action: PayloadAction<string | undefined>) {
        state.users = state.users.filter(
          (user) => Number(user.userId) !== Number(action.payload)
        );
      },
      prepare(userId: string | undefined) {
        return { payload: userId };
      },
    },
  },
  extraReducers: (builder) => {
    // fetching users
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchUsers.fulfilled,
        (state, action: PayloadAction<UsersState>) => {
          state.status = "succeeded";
          state.users = action.payload.users;
          state.page = action.payload.page;
          state.size = action.payload.size;
          state.totalElements = action.payload.totalElements;
          state.totalPages = action.payload.totalPages;
          state.error = null;
        }
      )
      .addCase(fetchUsers.rejected, (state, action: any) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const getAllUsers = (state: { users: UsersState }) => state.users;

export const getUserById = (userId: number) => (state: { users: UsersState }) =>
  state.users.users.find((user) => Number(user.userId) === userId);

export const getNumberOfUsers = (state: { users: UsersState }) =>
  state.users.users.length;

export const getUsersStatus = (state: { users: UsersState }) =>
  state.users.status;

export const getUsersError = (state: { users: UsersState }) =>
  state.users.error;

export const {
  setUsersStatus,
  addUser,
  updateUser,
  updateStatus,
  deleteUser,
  resetUsers,
} = usersSlice.actions;

export default usersSlice.reducer;
