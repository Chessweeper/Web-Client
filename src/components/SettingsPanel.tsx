import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import {
  ATTACKED_CELLS_STORAGE_KEY,
  SettingsContextState,
} from "../GlobalSettings";
import settingsImg from "../assets/settings.png";

interface SettingsPanelProps {
  settings: SettingsContextState;
  setSettings: Dispatch<SetStateAction<SettingsContextState>>;
}

export const SettingsPanel = ({
  settings,
  setSettings,
}: SettingsPanelProps): JSX.Element => {
  const [showPanel, setShowPanel] = useState(false);

  const onAttackedCellsCheckboxClicked = (e: ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      isAttackedCellValuesEnabled: checked,
    }));
    localStorage.setItem(ATTACKED_CELLS_STORAGE_KEY, checked.toString());
  };

  return (
    <>
      <input
        id="settings-button"
        type="image"
        src={settingsImg}
        onClick={() => setShowPanel((prev) => !prev)}
      />

      {showPanel && (
        <div id="settings-panel">
          <input
            id="attacked-cells-checkbox"
            className="toggle-checkbox"
            type="checkbox"
            checked={settings.isAttackedCellValuesEnabled}
            onChange={onAttackedCellsCheckboxClicked}
          />
          <label htmlFor="attacked-cells-checkbox">Show Attacked Cells</label>
        </div>
      )}
    </>
  );
};
