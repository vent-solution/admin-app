import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BidModel } from "../../bids/BidModel";
import axios from "axios";
import { fetchData } from "../../../global/api";

interface LandlordBidsState {
  userBids: BidModel[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  status: "idle" | "succeeded" | "failed" | "loading";
  error: string | null;
}

const initialState: LandlordBidsState = {
  userBids: [],
  page: 0,
  size: 0,
  totalElements: 0,
  totalPages: 0,
  status: "idle",
  error: null,
};

export const fetchLandlordBids = createAsyncThunk(
  "fetchLandlordBids",
  async ({
    userId,
    page,
    size,
  }: {
    userId: number;
    page: number;
    size: number;
  }) => {
    try {
      const result = await fetchData(
        `/fetch-bids-by-user/${userId}/${page}/${size}`
      );

      if (result.data.status && result.data.status !== "OK") {
        return initialState;
      }

      return result.data;
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("FETCH LANDLORD BIDS CANCELLED: ", error.message);
      }
    }
  }
);

const LandlordBidsSlice = createSlice({
  name: "userBids",
  initialState,
  reducers: {
    resetUserBids: {
      reducer(state, action: PayloadAction<LandlordBidsState>) {
        state.userBids = action.payload.userBids;
        state.page = action.payload.page;
        state.size = action.payload.size;
        state.totalElements = action.payload.totalElements;
        state.totalPages = action.payload.totalPages;
      },

      prepare(landlordBidsState: LandlordBidsState) {
        return { payload: landlordBidsState };
      },
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchLandlordBids.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchLandlordBids.fulfilled,
        (state, action: PayloadAction<LandlordBidsState>) => {
          state.userBids = action.payload.userBids;
          state.page = action.payload.page;
          state.size = action.payload.size;
          state.totalElements = action.payload.totalElements;
          state.totalPages = action.payload.totalPages;
          state.status = "succeeded";
          state.error = null;
        }
      )
      .addCase(fetchLandlordBids.rejected, (state, action: any) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const getLandlordBids = (state: { userBids: LandlordBidsState }) =>
  state.userBids;

export const { resetUserBids } = LandlordBidsSlice.actions;

export default LandlordBidsSlice.reducer;
