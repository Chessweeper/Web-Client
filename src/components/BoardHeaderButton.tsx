import rook from "../assets/wR.png";
import knook from "../assets/knook.png";
import pawn from "../assets/wP.png";
import { useBoardContext } from "./BoardWrapper";
import { useEffect } from "react";
import "./BoardHeaderButton.css";

export const BoardHeaderButton = (): JSX.Element => {
  const { ctx, reload } = useBoardContext();

  let image = rook;

  // Preload images
  useEffect(() => {
    new Image().src = rook;
    new Image().src = knook;
    new Image().src = pawn;
  }, []);

  if (ctx.gameover?.isWin === true) {
    image = knook;
  } else if (ctx.gameover?.isWin === false) {
    image = pawn;
  }

  return (
    <button
      id="board-header-button"
      onClick={reload}
      style={{ backgroundImage: `url(${image})` }}
    />
  );
};
