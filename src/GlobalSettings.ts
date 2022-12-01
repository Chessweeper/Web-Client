import { createContext, useContext } from "react";

export const ATTACKED_CELLS_STORAGE_KEY = "chessweeper-attacked-cells";

export interface SettingsContextState {
  isAttackedCellValuesEnabled: boolean;
}

export const SettingsContext = createContext<SettingsContextState>({
  isAttackedCellValuesEnabled: false,
});

export const useSettingsContext = () => useContext(SettingsContext);

export const getLocalStorageSettings = (): SettingsContextState => {
  const attackedCellsLocalStorage = localStorage.getItem(
    ATTACKED_CELLS_STORAGE_KEY
  );

  // Defaults
  let isAttackedCellValuesEnabled = true;

  if (attackedCellsLocalStorage !== null) {
    isAttackedCellValuesEnabled = attackedCellsLocalStorage === "true";
  }

  return {
    isAttackedCellValuesEnabled,
  };
};
