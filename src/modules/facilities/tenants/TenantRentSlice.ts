import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RentModel } from "../rent/RentModel";
import axios from "axios";
import { fetchData } from "../../../global/api";

interface StateModel {
  tenantRent: RentModel[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: StateModel = {
  tenantRent: [],
  page: 0,
  size: 0,
  totalElements: 0,
  totalPages: 0,
  status: "idle",
  error: null,
};

export const fetchRentByTenantAndAccommodation = createAsyncThunk(
  "fetchRentByTenantAndAccommodation",
  async ({
    tenantId,
    accommodationId,
    page,
    size,
  }: {
    tenantId: number;
    accommodationId: number;
    page: number;
    size: number;
  }) => {
    try {
      const result = await fetchData(
        `/fetch-rent-by-tenant-and-accommodation/${tenantId}/${accommodationId}/${page}/${size}`
      );

      if (
        (result.data.status && result.data.statsu !== "OK") ||
        result.status !== 200
      ) {
        return initialState;
      }

      console.log(result.data);

      return result.data;
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("FETCH TENANT RENT CANCELLED: ", error.message);
      }
    }
  }
);

const tenantRentSlice = createSlice({
  name: "tenantRent",
  initialState,
  reducers: {
    resetTenantRent: {
      reducer: (state, action: PayloadAction<StateModel>) => {
        state.tenantRent = action.payload.tenantRent;
        state.page = action.payload.page;
        state.size = action.payload.size;
        state.totalElements = action.payload.totalElements;
        state.totalPages = action.payload.totalPages;
      },
      prepare: (tenantRenatState: StateModel) => {
        return { payload: tenantRenatState };
      },
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchRentByTenantAndAccommodation.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchRentByTenantAndAccommodation.fulfilled,
        (state, action: PayloadAction<StateModel>) => {
          state.tenantRent = action.payload.tenantRent;
          state.page = action.payload.page;
          state.size = action.payload.size;
          state.totalElements = action.payload.totalElements;
          state.totalPages = action.payload.totalPages;
          state.status = "succeeded";
          state.error = null;
        }
      )
      .addCase(
        fetchRentByTenantAndAccommodation.rejected,
        (state, action: any) => {
          state.status = "failed";
          state.error = action.error.message;
        }
      );
  },
});

export const getTenantRent = (state: { tenantRent: StateModel }) =>
  state.tenantRent;

export const { resetTenantRent } = tenantRentSlice.actions;

export default tenantRentSlice.reducer;
