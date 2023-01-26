import { useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store";
import { toggleAttackedCellValuesEnabled } from "../store/settings";
import { Switch } from "./ui/Switch";
import { IoMdSettings as SettingsIcon } from "react-icons/io";
import { FaShare as ShareIcon } from "react-icons/fa";
import { BiHelpCircle as HelpIcon } from "react-icons/bi";
import { useBoardContext } from "./BoardWrapper";
import { Modal } from "./ui/Modal";
import { Tooltip } from "./ui/Tooltip";
import { isMobile } from "../util";
import "./BoardFooter.css";

export const BoardFooter = (): JSX.Element => {
  const {
    G: { seed },
  } = useBoardContext();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
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

  const share = async () => {
    const nativeShareData = {
      title: "Chessweeper",
      text: "Chess X Minesweeper",
      url: urlWithSeed,
    };

    if (isMobile() && navigator.canShare?.(nativeShareData)) {
      await navigator.share(nativeShareData);
    } else {
      setIsShareModalOpen(true);
    }
  };

  const help = () => {
    setIsHelpModalOpen(true);
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
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        isSmall={true}
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
      <Modal
        titleText="Help"
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
        isSmall={false}
      >
        <span className="modal-description">
          <h2>Basic Rules</h2>
          <p>
            The goal is to find where and what all the chess pieces are
            <br />
            Numbers on a tile represent the number of pieces that have that tile
            in check
            <br />
            Once you identified a piece, click on the related button under the
            board then click on the tile, click again to remove it
            <br />
            All kinds of pieces can appear many times, except the king that can
            appear only 1 time maximum
            <br />
            The top left number is the number of pieces that need to be placed
            on the board
            <br />
            <br />
            For more information on how the pieces move, please click{" "}
            <a
              href="https://en.wikipedia.org/wiki/Chess#Movement"
              target="_blank"
              rel="noreferrer"
            >
              here
            </a>
          </p>
          <h2>Classic Mode</h2>
          <p>
            The shovel allows you to dig a tile
            <br />
            You lose if you use your shovel on a chess piece, you win if you
            find all the pieces correctly
          </p>
          <h2>Puzzle Mode</h2>
          <p>
            You can&apos;t dig but have to find all the pieces based on the
            current board
          </p>
          <h2>Reverse Mode</h2>
          <p>
            The whole board is already completed except for the hint numbers
            <br />
            Enter how many times each tiles is in check
          </p>
          <h2>Special pieces</h2>
          <p>
            Knook: Has the same moves as a knight and a rook
            <br />
            Shogi pieces:{" "}
            <a
              href="https://en.wikipedia.org/wiki/Shogi#Movement"
              target="_blank"
              rel="noreferrer"
            >
              Wikipedia
            </a>
            <br />
            Black Pawn: Move downward
          </p>
        </span>
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
          <HelpIcon
            className="board-footer-icon"
            title="Help"
            size={25}
            onClick={help}
          />
        </div>
        {showSettings && (
          <div id="settings-panel">
            <Switch
              id="setting-attacked-cell-values"
              label="Show Attacked Cells"
              checked={settings.isAttackedCellValuesEnabled}
              onChange={() => dispatch(toggleAttackedCellValuesEnabled())}
            />
          </div>
        )}
      </div>
    </>
  );
};
