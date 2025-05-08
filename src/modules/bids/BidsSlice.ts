import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BidModel } from "./BidModel";
import axios from "axios";
import { fetchData } from "../../global/api";

interface BidsState {
  bids: BidModel[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  status: "idel" | "failed" | "succeeded" | "loading";
  error: string | null;
}

const initialState: BidsState = {
  bids: [],
  page: 0,
  size: 0,
  totalElements: 0,
  totalPages: 0,
  status: "idel",
  error: null,
};

export const fetchBids = createAsyncThunk(
  "fetchBids",
  async (
    { page, size }: { page: number; size: number },
    { rejectWithValue }
  ) => {
    try {
      const result = await fetchData(`/fetch-all-bids/${page}/${size}`);
      if (result.data.status && result.data.status !== "OK") {
        return initialState;
      }
      return result.data;
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("FETCH BIDS CANCELLED ", error.message);
        return rejectWithValue("Fetch bids cancelled");
      }
      // Handle other errors, like network issues
      console.error("Error fetching bids: ", error);
      return rejectWithValue("Error: Unable to fetch bids");
    }
  }
);

const BidsSlice = createSlice({
  name: "bids",
  initialState,

  reducers: {
    // reset bids
    resetBids: {
      reducer(state, action: PayloadAction<BidsState>) {
        state.bids = action.payload.bids;
        state.size = action.payload.size;
        state.page = action.payload.page;
        state.totalElements = action.payload.totalElements;
        state.totalPages = action.payload.totalPages;
      },

      prepare(bidsState: BidsState) {
        return { payload: bidsState };
      },
    },
  },

  // initial fetching of bids
  extraReducers: (builder) => {
    builder
      .addCase(fetchBids.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchBids.fulfilled,
        (state, action: PayloadAction<BidsState>) => {
          state.bids = action.payload.bids;
          state.size = action.payload.size;
          state.page = action.payload.page;
          state.totalElements = action.payload.totalElements;
          state.totalPages = action.payload.totalPages;
          state.status = "succeeded";
          state.error = null;
        }
      )
      .addCase(fetchBids.rejected, (state, action: any) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const getBids = (state: { bids: BidsState }) => state.bids;

export const { resetBids } = BidsSlice.actions;

export default BidsSlice.reducer;
