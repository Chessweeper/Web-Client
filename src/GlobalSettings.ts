import { createContext, useContext } from "react";

export const ATTACKED_CELLS_STORAGE_KEY = "chessweeper-attacked-cells";

export interface SettingsContextState {
  isAttackedCellValuesEnabled: boolean;
}

const DEFAULT_SETTINGS: SettingsContextState = {
  isAttackedCellValuesEnabled: true,
};

export const SettingsContext =
  createContext<SettingsContextState>(DEFAULT_SETTINGS);

export const useSettingsContext = () => useContext(SettingsContext);

export const getLocalStorageSettings = (): SettingsContextState => {
  const settings = DEFAULT_SETTINGS;

  const attackedCellsLocalStorage = localStorage.getItem(
    ATTACKED_CELLS_STORAGE_KEY
  );
  if (attackedCellsLocalStorage !== null) {
    settings.isAttackedCellValuesEnabled = attackedCellsLocalStorage === "true";
  }

  return settings;
};
