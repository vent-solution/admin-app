import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SpaceModel } from "./SpaceModel";
import { fetchData } from "../../../global/api";
import axios from "axios";

interface StateModel {
  spaces: SpaceModel[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  status: "idle" | "succeeded" | "loading" | "failed";
  error: string | null;
}

const initialState: StateModel = {
  spaces: [],
  page: 0,
  size: 0,
  totalElements: 0,
  totalPages: 0,
  status: "idle",
  error: null,
};

export const fetchSpaces = createAsyncThunk(
  "fetchSpaces",
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
        `/fetch-spaces-by-facility/${facilityId}/${page}/${size}`
      );

      if (result.data.status && result.data.status !== "OK") {
        return initialState;
      }

      return result.data;
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("FETCH SPACES CANCELLED: ", error.message);
      }
    }
  }
);

const spapcesSlice = createSlice({
  name: "spaces",
  initialState,
  reducers: {
    resetSpaces: {
      reducer: (state, action: PayloadAction<StateModel>) => {
        state.spaces = action.payload.spaces;
        state.page = action.payload.page;
        state.size = action.payload.size;
        state.totalElements = action.payload.totalElements;
        state.totalPages = action.payload.totalPages;
      },

      prepare: (spacesState: StateModel) => {
        return { payload: spacesState };
      },
    },
  },

  // extra reducers
  extraReducers: (builder) => {
    builder
      .addCase(fetchSpaces.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchSpaces.fulfilled,
        (state, action: PayloadAction<StateModel>) => {
          state.spaces = action.payload.spaces;
          state.page = action.payload.page;
          state.size = action.payload.size;
          state.totalElements = action.payload.totalElements;
          state.totalPages = action.payload.totalPages;
          state.status = "succeeded";
          state.error = null;
        }
      )
      .addCase(fetchSpaces.rejected, (state, action: any) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const getSpaces = (state: { spaces: StateModel }) => state.spaces;

export const { resetSpaces } = spapcesSlice.actions;

export default spapcesSlice.reducer;
