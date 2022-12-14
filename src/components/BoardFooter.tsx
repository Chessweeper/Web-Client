import { ChangeEvent, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store";
import { settingsSlice } from "../store/settings";
import { Switch } from "./ui/Switch";
import { IoMdSettings as SettingsIcon } from "react-icons/io";
import { FaShare as ShareIcon } from "react-icons/fa";
import { useBoardContext } from "./BoardWrapper";
import { Modal } from "./ui/Modal";
import { isMobile } from "../util";
import "./BoardFooter.css";

export const BoardFooter = (): JSX.Element => {
  const {
    G: { seed },
  } = useBoardContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const settings = useAppSelector((s) => s.settings);
  const dispatch = useAppDispatch();

  const onAttackedCellsCheckboxClicked = (e: ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    dispatch(settingsSlice.actions.setIsAttackedCellValuesEnabled(checked));
  };

  const share = async () => {
    const url = new URL(window.location.href);
    if (url.searchParams.get("r") === null) {
      // todo: seed needs to be attached to the game so it can be retrieved here
      const urlSeed = seed ?? "testseed";
      url.searchParams.append("r", urlSeed);
    }

    if (isMobile() && navigator.canShare?.()) {
      const shareData = {
        title: "Chessweeper",
        text: "Chess X Minesweeper",
        url: url.href,
      };

      await navigator.share(shareData);
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <Modal
        title="Share"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <div id="board-footer" className="flex">
        <div id="board-footer-icons" className="flex hor">
          <SettingsIcon
            id="settings-button"
            className="board-footer-icon"
            size={25}
            onClick={() => setShowSettings((prev) => !prev)}
          />
          <ShareIcon className="board-footer-icon" size={20} onClick={share} />
        </div>
        {showSettings && (
          <div id="settings-panel">
            <Switch
              id="setting-attacked-cell-values"
              label="Show Attacked Cells"
              checked={settings.isAttackedCellValuesEnabled}
              onChange={onAttackedCellsCheckboxClicked}
            />
          </div>
        )}
      </div>
    </>
  );
};
