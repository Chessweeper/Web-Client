import { ChangeEvent, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store";
import { settingsSlice } from "../store/settings";
import { Switch } from "./Switch";
import { IoMdSettings as SettingsIcon } from "react-icons/io";
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
      <SettingsIcon
        id="settings-button"
        size={25}
        onClick={() => setShowSettings((prev) => !prev)}
      />
      {showSettings && (
        <Switch
          id="setting-attacked-cell-values"
          label="Show Attacked Cells"
          checked={settings.isAttackedCellValuesEnabled}
          onChange={onAttackedCellsCheckboxClicked}
        />
      )}
    </div>
  );
};
