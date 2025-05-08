// usersSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserModel } from "../../users/models/userModel";

// users state type
interface LandlordsUsersState {
  landlordUsers: UserModel[];
  size: number;
  page: number;
  totalElements: number;
  totalPages: number;
  status: string;
  error: string | null;
}

// initial users state
const initialState: LandlordsUsersState = {
  landlordUsers: [],
  size: 0,
  page: 0,
  totalElements: 0,
  totalPages: 0,
  status: "idle",
  error: null,
};

// create users slice
const landlordUsersSlice = createSlice({
  name: "landlordUsers",
  initialState,
  reducers: {
    // resting users on each fetch
    resetLandlordsUsers: {
      reducer(state, action: PayloadAction<LandlordsUsersState>) {
        state.landlordUsers = action.payload.landlordUsers;
        state.page = action.payload.page;
        state.size = action.payload.size;
        state.totalElements = action.payload.totalElements;
        state.totalPages = action.payload.totalPages;
        state.status = "succeded";
        state.error = null;
      },

      prepare(landlordUsers: LandlordsUsersState) {
        return { payload: landlordUsers };
      },
    },
  },
});

export const getAllLandlordsUsers = (state: {
  landlordUsers: LandlordsUsersState;
}) => state.landlordUsers;

export const { resetLandlordsUsers } = landlordUsersSlice.actions;

export default landlordUsersSlice.reducer;
