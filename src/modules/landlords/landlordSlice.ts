import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LandlordModel } from "./models/LandlordModel";
import { fetchData } from "../../global/api";
import axios from "axios";

interface UpdateModel {
  id: string | undefined;
  changes: LandlordModel;
}
// landlord state interface
interface LandlordsState {
  landlords: LandlordModel[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

// landlords initial state
const initialState: LandlordsState = {
  landlords: [],
  page: 0,
  size: 25,
  totalElements: 0,
  totalPages: 0,
  status: "idle",
  error: null,
};

// async thunk for fetching landlords
export const fetchLandlords = createAsyncThunk(
  "fetchLandlords",
  async ({ page, size }: { page: number; size: number }) => {
    try {
      const result = await fetchData(`/fetchLandlords/${page}/${size}`);

      if (!result) {
        return initialState;
      }

      if (result.data.status && result.data.status !== "OK") {
        return initialState;
      }
      return result.data;
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("FETCH LANDLORDS CANCELLED ", error.message);
      }
    }
  }
);

// creating landlords slice
const landlordsSlice = createSlice({
  name: "landlords",
  initialState,

  // intitial reducer
  reducers: {
    // reset landlords
    resetLandlords: {
      reducer(state, action: PayloadAction<LandlordsState>) {
        state.landlords = action.payload.landlords;
        state.page = action.payload.page;
        state.size = action.payload.size;
        state.totalElements = action.payload.totalElements;
        state.totalPages = action.payload.totalPages;
      },
      prepare(landlords: LandlordsState) {
        return { payload: landlords };
      },
    },

    // add new landlord
    addLandlord: {
      reducer(state, action: PayloadAction<LandlordModel>) {
        state.landlords.push(action.payload);
      },
      prepare(landlord: LandlordModel) {
        return {
          payload: landlord,
        };
      },
    },

    // update landlord
    updateLandlord: {
      reducer(state, action: PayloadAction<UpdateModel>) {
        const { id, changes } = action.payload;
        const landlordIndex = state.landlords.findIndex(
          (landlord) => Number(landlord.user?.userId) === Number(id)
        );

        if (landlordIndex >= 0) {
          state.landlords[landlordIndex].user = {
            ...state.landlords[landlordIndex].user,
            ...changes,
          };
        }
      },
      prepare(changes: UpdateModel) {
        return { payload: changes };
      },
    },

    // update landlord status
    updateLandlordStatus: {
      reducer(
        state,
        action: PayloadAction<{ userId: number; userStatus: string }>
      ) {
        const { userId, userStatus } = action.payload;
        const landlordIndex = state.landlords.findIndex(
          (landlord) => Number(landlord.user?.userId) === Number(userId)
        );

        if (landlordIndex >= 0) {
          state.landlords[landlordIndex].user = {
            ...state.landlords[landlordIndex].user,
            userStatus: userStatus,
          };
        }
      },
      prepare(changes: { userId: number; userStatus: string }) {
        return { payload: changes };
      },
    },

    // delete landlord
    deleteLandlord: {
      reducer(state, action: PayloadAction<string | undefined>) {
        state.landlords = state.landlords.filter(
          (landlord) => Number(landlord.user?.userId) !== Number(action.payload)
        );
      },
      prepare(landlordId: string | undefined) {
        return { payload: landlordId };
      },
    },
  },

  // extra reducers
  extraReducers: (builder) => {
    // fetching landlords front the database
    builder
      .addCase(fetchLandlords.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchLandlords.fulfilled,
        (state, action: PayloadAction<LandlordsState>) => {
          state.landlords = action.payload.landlords;
          state.page = action.payload.page;
          state.size = action.payload.size;
          state.totalElements = action.payload.totalElements;
          state.totalPages = action.payload.totalPages;
          state.status = "succeeded";
          state.error = null;
        }
      )
      .addCase(fetchLandlords.rejected, (state, action: any) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const getAllLandlords = (state: { landlords: LandlordsState }) =>
  state.landlords;

export const getLandlordsStatus = (state: { landlords: LandlordsState }) =>
  state.landlords.status;

export const getLandlordsError = (state: { landlords: LandlordsState }) =>
  state.landlords.error;

export const findLandlordById = (
  state: {
    landlords: LandlordsState;
  },
  id: number | undefined
) =>
  state.landlords.landlords.find(
    (landlord) => Number(landlord.user?.userId) === id
  );

export const {
  addLandlord,
  updateLandlord,
  updateLandlordStatus,
  deleteLandlord,
  resetLandlords,
} = landlordsSlice.actions;

export default landlordsSlice.reducer;
