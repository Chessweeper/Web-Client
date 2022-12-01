import { ChangeEvent, Dispatch, SetStateAction } from "react";
import {
  ATTACKED_CELLS_STORAGE_KEY,
  SettingsContextState,
} from "../GlobalSettings";

interface SettingsPanelProps {
  settings: SettingsContextState;
  setSettings: Dispatch<SetStateAction<SettingsContextState>>;
}

export const SettingsPanel = ({
  settings,
  setSettings,
}: SettingsPanelProps): JSX.Element => {
  const onAttackedCellsCheckboxClicked = (e: ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      isAttackedCellValuesEnabled: checked,
    }));
    localStorage.setItem(ATTACKED_CELLS_STORAGE_KEY, checked.toString());
  };

  return (
    <div className="settings">
      <input
        className="toggle-checkbox"
        type="checkbox"
        checked={settings.isAttackedCellValuesEnabled}
        onChange={onAttackedCellsCheckboxClicked}
      />
    </div>
  );
};
