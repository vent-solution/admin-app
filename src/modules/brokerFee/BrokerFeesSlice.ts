import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BrokerFeeModel } from "./BrokerFeeModel";
import axios from "axios";
import { fetchData } from "../../global/api";

interface BrokerFeesState {
  brokerFees: BrokerFeeModel[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  status: "idel" | "failed" | "succeeded" | "loading";
  error: string | null;
}

const initialState: BrokerFeesState = {
  brokerFees: [],
  page: 0,
  size: 0,
  totalElements: 0,
  totalPages: 0,
  status: "idel",
  error: null,
};

export const fetchBrokerFees = createAsyncThunk(
  "fetchBrokerFees",
  async ({ page, size }: { page: number; size: number }) => {
    try {
      const result = await fetchData(`/fetch-broker-fees/${page}/${size}`);
      if (result.data.status && result.data.status !== "OK") {
        return initialState;
      }
      return result.data;
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("FETCH BROKER FEES CANCELLED ", error.message);
      }
    }
  }
);

const BrokerFeesSlice = createSlice({
  name: "brokerFees",
  initialState,
  reducers: {
    resetBrokerFees: {
      reducer(state, action: PayloadAction<BrokerFeesState>) {
        state.brokerFees = action.payload.brokerFees;
        state.page = action.payload.page;
        state.size = action.payload.size;
        state.totalElements = action.payload.totalElements;
        state.totalPages = action.payload.totalPages;
      },

      prepare(brokerFees: BrokerFeesState) {
        return { payload: brokerFees };
      },
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBrokerFees.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchBrokerFees.fulfilled,
        (state, action: PayloadAction<BrokerFeesState>) => {
          state.brokerFees = action.payload.brokerFees;
          state.page = action.payload.page;
          state.size = action.payload.size;
          state.totalElements = action.payload.totalElements;
          state.totalPages = action.payload.totalPages;
          state.status = "succeeded";
          state.error = null;
        }
      )
      .addCase(fetchBrokerFees.rejected, (state, action: any) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const getBrokerFees = (state: { brokerFees: BrokerFeesState }) =>
  state.brokerFees;

export const { resetBrokerFees } = BrokerFeesSlice.actions;

export default BrokerFeesSlice.reducer;
