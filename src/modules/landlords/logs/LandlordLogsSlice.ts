import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LogModel } from "../../logs/LogModel";
import axios from "axios";
import { fetchData } from "../../../global/api";

interface UserLogsState {
  userLogs: LogModel[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  status: "idle" | "succeded" | "loading" | "failed";
  error: string | null;
}

const initialState: UserLogsState = {
  userLogs: [],
  page: 0,
  size: 0,
  totalElements: 0,
  totalPages: 0,
  status: "idle",
  error: null,
};

export const fetchLandlordLogs = createAsyncThunk(
  "fetchLandlordLogs",
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
        `/fetch-logs-by-user/${userId}/${page}/${size}`
      );

      if (result.status !== 200) {
        return initialState;
      }

      if (result.data.status && result.data.status !== "OK") {
        console.log(result.data.message);
        return initialState;
      }
      return result.data;
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("FETCH LANDLORD LOGS CANCELLED: ", error.message);
      }
    }
  }
);

const LandlordLogsSlice = createSlice({
  name: "userLogs",
  initialState,
  reducers: {
    resetUserLogs: {
      reducer(state, action: PayloadAction<UserLogsState>) {
        state.userLogs = action.payload.userLogs;
        state.page = action.payload.page;
        state.size = action.payload.size;
        state.totalElements = action.payload.totalElements;
        state.totalPages = action.payload.totalPages;
      },
      prepare(landlordLogs: UserLogsState) {
        return { payload: landlordLogs };
      },
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLandlordLogs.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchLandlordLogs.fulfilled,
        (state, action: PayloadAction<UserLogsState>) => {
          state.userLogs = action.payload.userLogs;
          state.page = action.payload.page;
          state.size = action.payload.size;
          state.totalElements = action.payload.totalElements;
          state.totalPages = action.payload.totalPages;
          state.status = "succeded";
          state.error = null;
        }
      )
      .addCase(fetchLandlordLogs.rejected, (state, action: any) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const getLandlordLogs = (state: { userLogs: UserLogsState }) =>
  state.userLogs;

export const { resetUserLogs } = LandlordLogsSlice.actions;

export default LandlordLogsSlice.reducer;
