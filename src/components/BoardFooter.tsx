import { ChangeEvent, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store";
import { setIsAttackedCellValuesEnabled } from "../store/settings";
import { Switch } from "./ui/Switch";
import { IoMdSettings as SettingsIcon } from "react-icons/io";
import { FaShare as ShareIcon } from "react-icons/fa";
import { useBoardContext } from "./BoardWrapper";
import { Modal } from "./ui/Modal";
import { Tooltip } from "./ui/Tooltip";
import { isMobile } from "../util";
import "./BoardFooter.css";

export const BoardFooter = (): JSX.Element => {
  const {
    G: { seed },
  } = useBoardContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const settings = useAppSelector((s) => s.settings);
  const dispatch = useAppDispatch();

  const urlWithSeed = useMemo(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.get("r") === null) {
      url.searchParams.append("r", seed);
    }
    return url.href;
  }, [seed]);

  const onAttackedCellsCheckboxClicked = (e: ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    dispatch(setIsAttackedCellValuesEnabled(checked));
  };

  const share = async () => {
    const nativeShareData = {
      title: "Chessweeper",
      text: "Chess X Minesweeper",
      url: urlWithSeed,
    };

    if (isMobile() && navigator.canShare?.(nativeShareData)) {
      await navigator.share(nativeShareData);
    } else {
      setIsModalOpen(true);
    }
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(urlWithSeed);
    setIsTooltipVisible(true);
    setTimeout(() => {
      setIsTooltipVisible(false);
    }, 2000);
  };

  return (
    <>
      <Modal
        titleText="Share this Board"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <p className="modal-description">
          Share this board with the random seed included in the url.
        </p>
        <div className="modal-copy-section flex hor">
          <div className="modal-link">{urlWithSeed}</div>
          <Tooltip text="Copied" direction="top" isVisible={isTooltipVisible}>
            <button className="button" onClick={copyToClipboard}>
              Copy
            </button>
          </Tooltip>
        </div>
      </Modal>
      <div id="board-footer" className="flex">
        <div id="board-footer-icons" className="flex hor">
          <SettingsIcon
            className="board-footer-icon"
            title="Settings"
            size={25}
            onClick={() => setShowSettings((prev) => !prev)}
          />
          <ShareIcon
            className="board-footer-icon"
            title="Share this Board"
            size={20}
            onClick={share}
          />
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
