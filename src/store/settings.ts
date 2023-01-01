import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const ATTACKED_CELLS_STORAGE_KEY = "chessweeper-attacked-cells";

export interface Settings {
  isAttackedCellValuesEnabled: boolean;
}

const initialState: Settings = {
  isAttackedCellValuesEnabled:
    localStorage.getItem(ATTACKED_CELLS_STORAGE_KEY) === "true",
};

const settingsSlice = createSlice({
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

export const { setIsAttackedCellValuesEnabled } = settingsSlice.actions;
export default settingsSlice.reducer;
