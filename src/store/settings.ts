import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { startAppListening } from "./listenerMiddleware";

export const SETTINGS_STORAGE_KEY = "chessweeper-settings";

export interface Settings {
  isAttackedCellValuesEnabled: boolean;
}

const initialState = (): Settings => {
  const localSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
  const settings: Settings | null = JSON.parse(localSettings ?? "null");
  return {
    isAttackedCellValuesEnabled: settings?.isAttackedCellValuesEnabled ?? true,
  };
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    toggleAttackedCellValuesEnabled: (state) => {
      state.isAttackedCellValuesEnabled = !state.isAttackedCellValuesEnabled;
    },
  },
});

export const { toggleAttackedCellValuesEnabled } = settingsSlice.actions;
export default settingsSlice.reducer;

startAppListening({
  matcher: isAnyOf(toggleAttackedCellValuesEnabled),
  effect: async (action, listenerApi) => {
    const settingsState = listenerApi.getState().settings;
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settingsState));
  },
});
