import { ChangeEvent, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store";
import { settingsSlice } from "../store/settings";
import settingsImg from "../assets/settings.png";
import "./SettingsPanel.css";

export const SettingsPanel = (): JSX.Element => {
  const [showSettings, setShowSettings] = useState(false);
  const settings = useAppSelector((s) => s.settings);
  const dispatch = useAppDispatch();

  const onAttackedCellsCheckboxClicked = (e: ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    dispatch(settingsSlice.actions.setIsAttackedCellValuesEnabled(checked));
  };

  return (
    <div id="settings-panel" className="flex">
      <input
        id="settings-button"
        type="image"
        src={settingsImg}
        onClick={() => setShowSettings((prev) => !prev)}
      />
      {showSettings && (
        <div className="switch-container">
          <label className="switch">
            <input
              id="setting-attacked-cell-values"
              type="checkbox"
              checked={settings.isAttackedCellValuesEnabled}
              onChange={onAttackedCellsCheckboxClicked}
            />
            <span className="slider"></span>
          </label>
          <label
            className="switch-label"
            htmlFor="setting-attacked-cell-values"
          >
            Show Attacked Cells
          </label>
        </div>
      )}
    </div>
  );
};
