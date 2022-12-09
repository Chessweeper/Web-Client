import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const ATTACKED_CELLS_STORAGE_KEY = "chessweeper-attacked-cells";

interface State {
  isAttackedCellValuesEnabled: boolean;
}

const initialState: State = {
  isAttackedCellValuesEnabled:
    localStorage.getItem(ATTACKED_CELLS_STORAGE_KEY) === "true",
};

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setIsAttackedCellValuesEnabled: (state, action: PayloadAction<boolean>) => {
      state.isAttackedCellValuesEnabled = action.payload;
      localStorage.setItem(
        ATTACKED_CELLS_STORAGE_KEY,
        action.payload.toString()
      );
    },
  },
});
