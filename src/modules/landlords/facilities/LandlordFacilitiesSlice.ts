// LandlordFacilitiesSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../../app/store";
import { fetchData } from "../../../global/api";
import axios from "axios";
import { FacilitiesModel } from "../../facilities/FacilityModel";

// Define a type for the facility
interface FacilitiesState {
  facilities: FacilitiesModel[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: FacilitiesState = {
  facilities: [],
  page: 0,
  size: 0,
  totalElements: 0,
  totalPages: 0,
  status: "idle",
  error: null,
};

export const fetchLandlordFacilities = createAsyncThunk(
  "landlordFacilities/fetchLandlordFacilities",
  async ({
    page,
    size,
    userId,
  }: {
    page: number;
    size: number;
    userId: number;
  }) => {
    try {
      const response = await fetchData(
        `/fetch-facilities-by-landlord/${userId}/${page}/${size}`
      );

      if (response.data.status && response.data.status !== "OK") {
        return initialState;
      }
      return response.data;
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("FETCH LANDLORD FACILITIES CANCELLED ", error.message);
      }
    }
  }
);

const landlordFacilitiesSlice = createSlice({
  name: "landlordFacilities",
  initialState,
  reducers: {
    resetLandlordFacilities: {
      reducer(state, action: PayloadAction<FacilitiesState>) {
        state.facilities = action.payload.facilities;
        state.page = action.payload.page;
        state.size = action.payload.size;
        state.totalElements = action.payload.totalElements;
        state.totalPages = action.payload.totalPages;
        state.error = action.payload.error;
      },
      prepare(facilitiesState: FacilitiesState) {
        return { payload: facilitiesState };
      },
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLandlordFacilities.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchLandlordFacilities.fulfilled,
        (state, action: PayloadAction<FacilitiesState>) => {
          state.facilities = action.payload.facilities;
          state.page = action.payload.page;
          state.size = action.payload.size;
          state.totalElements = action.payload.totalElements;
          state.totalPages = action.payload.totalPages;
          state.status = "succeeded";
          state.error = null;
        }
      )
      .addCase(fetchLandlordFacilities.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch facilities";
      });
  },
});

// Export the selector
export const getAllLandlordFacilities = (state: RootState) =>
  state.landlordFacilities;

// Export all the actions
export const { resetLandlordFacilities } = landlordFacilitiesSlice.actions;

// Export the reducer
export default landlordFacilitiesSlice.reducer;
