import rook from "../assets/wR.png";
import knook from "../assets/knook.png";
import pawn from "../assets/wP.png";
import { useBoardContext } from "./BoardWrapper";

export const BoardHeaderButton = (): JSX.Element => {
  const { ctx, reload } = useBoardContext();

  let image = rook;

  if (ctx.gameover?.isWin === true) {
    image = knook;
  } else if (ctx.gameover?.isWin === false) {
    image = pawn;
  } else if (ctx.gameover) {
    return <h2>{ctx.gameover?.error ?? "Error"}</h2>;
  }

  return (
    <button id="board-header-button" onClick={reload}>
      <img src={image} />
    </button>
  );
};
