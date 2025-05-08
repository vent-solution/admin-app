import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FacilitiesModel } from "./FacilityModel";
import axios from "axios";
import { fetchData } from "../../global/api";

export interface FacilitiesState {
  otherFacilities: FacilitiesModel[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  status: "idle" | "succeeded" | "failed" | "loading";
  error: string | null;
}

const initialState: FacilitiesState = {
  otherFacilities: [],
  page: 0,
  size: 0,
  totalElements: 0,
  totalPages: 0,
  status: "idle",
  error: null,
};

export const fetchFacilities = createAsyncThunk(
  "fetchFacilities",
  async ({ page, size }: { page: number; size: number }) => {
    try {
      const result = await fetchData(`/fetch-facilities/${page}/${size}`);

      if (!result || result.data.status === 404) {
        return initialState;
      }

      if (result.data.status && result.data.status !== "OK") {
        return initialState;
      }
      return result.data;
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("FETCH FACILITIES CANCELLED: ", error.message);
      }
    }
  }
);

const facilitiesSlice = createSlice({
  name: "facilities",
  initialState,
  reducers: {
    resetFacilities: {
      reducer(state, action: PayloadAction<FacilitiesState>) {
        state.otherFacilities = action.payload.otherFacilities;
        state.page = action.payload.page;
        state.size = action.payload.size;
        state.totalElements = action.payload.totalElements;
        state.totalPages = action.payload.totalPages;
      },

      prepare(facilitiesState: FacilitiesState) {
        return { payload: facilitiesState };
      },
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFacilities.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchFacilities.fulfilled,
        (state, action: PayloadAction<FacilitiesState>) => {
          state.otherFacilities = action.payload.otherFacilities;
          state.page = action.payload.page;
          state.size = action.payload.size;
          state.totalElements = action.payload.totalElements;
          state.totalPages = action.payload.totalPages;
          state.status = "succeeded";
          state.error = null;
        }
      )
      .addCase(fetchFacilities.rejected, (state, action: any) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { resetFacilities } = facilitiesSlice.actions;

export const getFacilities = (state: { facilities: FacilitiesState }) =>
  state.facilities;

export const findFacilityById =
  (facilityId: number) => (state: { facilities: FacilitiesState }) =>
    state.facilities.otherFacilities.find(
      (facility) => Number(facility.facilityId) === Number(facilityId)
    );

export default facilitiesSlice.reducer;
