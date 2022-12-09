import { ChangeEvent } from "react";
import { useAppDispatch, useAppSelector } from "../store";
import { settingsSlice } from "../store/settings";

export const SettingsPanel = (): JSX.Element => {
  const settings = useAppSelector((s) => s.settings);
  const dispatch = useAppDispatch();

  const onAttackedCellsCheckboxClicked = (e: ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    dispatch(settingsSlice.actions.setIsAttackedCellValuesEnabled(checked));
  };

  return (
    <div style={{ display: "flex", alignItems: "center", marginTop: "10px" }}>
      <label className="switch">
        <input
          id="deezums"
          type="checkbox"
          checked={settings.isAttackedCellValuesEnabled}
          onChange={onAttackedCellsCheckboxClicked}
        />
        <span className="slider"></span>
      </label>
      <label
        style={{ marginLeft: "10px", fontWeight: "bold", fontSize: "16px" }}
        htmlFor="deezums"
      >
        Show Attacked Cells
      </label>
    </div>
  );
};
