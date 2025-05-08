import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { fetchData } from "../../../global/api";
import { HistoryModel } from "../history/HistoryModel";

interface StateModel {
  facilityTenants: HistoryModel[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  status: "idle" | "succeeded" | "loading" | "failed";
  error: string | null;
}

const initialState: StateModel = {
  facilityTenants: [],
  page: 0,
  size: 0,
  totalElements: 0,
  totalPages: 0,
  status: "idle",
  error: null,
};

export const fetchFacilityTenants = createAsyncThunk(
  "fetchTenants",
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
        `/fetch-facility-tenants/${facilityId}/${page}/${size}`
      );

      if (!result) {
        console.log("ERROR OCCURRED ON FETCHING FACILITY TENANTS");
        return initialState;
      }

      if (
        (result.data.status && result.data.status !== "OK") ||
        result.status !== 200
      ) {
        return initialState;
      }
      return result.data;
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("FETCH TENANTS CANCELLED: ", error.message);
        return initialState;
      }
    }
  }
);

const facilityTenantsSlice = createSlice({
  name: "facilityTenants",
  initialState,
  reducers: {
    resetFacilityTenants: {
      reducer: (state, action: PayloadAction<StateModel>) => {
        state.facilityTenants = action.payload.facilityTenants;
        state.page = action.payload.page;
        state.size = action.payload.size;
        state.totalElements = action.payload.totalElements;
        state.totalPages = action.payload.totalPages;
      },
      prepare: (tenantsState: StateModel) => {
        return { payload: tenantsState };
      },
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchFacilityTenants.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchFacilityTenants.fulfilled,
        (state, action: PayloadAction<StateModel>) => {
          state.facilityTenants = action.payload.facilityTenants;
          state.page = action.payload.page;
          state.size = action.payload.size;
          state.totalElements = action.payload.totalElements;
          state.totalPages = action.payload.totalPages;
          state.status = "succeeded";
          state.error = null;
        }
      )
      .addCase(fetchFacilityTenants.rejected, (state, action: any) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const getFacilityTenants = (state: { facilityTenants: StateModel }) =>
  state.facilityTenants.facilityTenants;

export const getFacilityTenantHistory = (state: {
  facilityTenants: StateModel;
}) => state.facilityTenants;

export const getTenantById =
  (tenantId: number) => (state: { facilityTenants: StateModel }) =>
    state.facilityTenants.facilityTenants.find(
      (tenant) => Number(tenant.tenant.tenantId) === Number(tenantId)
    );

export const { resetFacilityTenants } = facilityTenantsSlice.actions;

export default facilityTenantsSlice.reducer;
