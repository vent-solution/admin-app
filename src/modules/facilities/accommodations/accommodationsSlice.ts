import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AccommodationModel } from "./AccommodationModel";
import axios from "axios";
import { fetchData } from "../../../global/api";

interface StateModel {
  facilityAccommodations: AccommodationModel[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: StateModel = {
  facilityAccommodations: [],
  page: 0,
  size: 0,
  totalElements: 0,
  totalPages: 0,
  status: "idle",
  error: null,
};

export const fetchAccommodationsByFacility = createAsyncThunk(
  "fetchAccommodationsByFacility",
  async ({
    facilityId,
    page,
    size,
  }: {
    facilityId: number;
    page: number;
    size: number;
  }) => {
    try {
      const result = await fetchData(
        `/fetch-accommodations-by-facility/${facilityId}/${page}/${size}`
      );

      if (
        (result.data.status && result.data.status !== "OK") ||
        result.status !== 200
      ) {
        return initialState;
      }
      return result.data;
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log(
          "FETCH ACCOMMODATIONS BY FACILITY CANCELLED: ",
          error.message
        );
      }
    }
  }
);

const accommodationsSlice = createSlice({
  name: "facilityAccommodations",
  initialState,
  reducers: {
    resetFacilityAccommodations: {
      reducer: (state, action: PayloadAction<StateModel>) => {
        state.facilityAccommodations = action.payload.facilityAccommodations;
        state.page = action.payload.page;
        state.size = action.payload.size;
        state.totalElements = action.payload.totalElements;
        state.totalPages = action.payload.totalPages;
      },

      prepare: (accommodationsState: StateModel) => {
        return { payload: accommodationsState };
      },
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchAccommodationsByFacility.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchAccommodationsByFacility.fulfilled,
        (state, action: PayloadAction<StateModel>) => {
          state.facilityAccommodations = action.payload.facilityAccommodations;
          state.page = action.payload.page;
          state.size = action.payload.size;
          state.totalElements = action.payload.totalElements;
          state.totalPages = action.payload.totalPages;
          state.status = "succeeded";
          state.error = null;
        }
      )
      .addCase(fetchAccommodationsByFacility.rejected, (state, action: any) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const getFacilityAccommodations = (state: {
  facilityAccommodations: StateModel;
}) => state.facilityAccommodations;

export const getAccommodationByTenant =
  (tenantId: number) => (state: { facilityAccommodations: StateModel }) =>
    state.facilityAccommodations.facilityAccommodations.find(
      (fc) =>
        fc.tenants &&
        fc.tenants.find((tnt) => Number(tnt.tenantId) === tenantId)
    );

export const { resetFacilityAccommodations } = accommodationsSlice.actions;

export default accommodationsSlice.reducer;
