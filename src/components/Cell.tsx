import { useMemo } from "react";
import { getPiece } from "../Pieces";
import { useBoardContext } from "./BoardWrapper";

interface CellProps {
  id: number;
}

export const Cell = ({ id }: CellProps) => {
  const { G, ctx, moves, currAction, timer } = useBoardContext();
  let className = "cell";
  let value: string | JSX.Element = "";

  const isWhite = useMemo(() => {
    const y = Math.floor(id / G.size);
    const x = id % G.size;
    return (y % 2 == 0 && x % 2 == 0) || (y % 2 == 1 && x % 2 == 1);
  }, [id, G.size]);

  const onCellClick = () => {
    if (ctx.gameover) {
      return;
    }

    if (!timer.isRunning()) {
      timer.start();
    }

    if (currAction !== "") {
      if (G.knownCells?.[id] === currAction) {
        moves.removeHint(id);
      } else {
        moves.placeHint(id, currAction);
      }
    } else {
      moves.discoverPiece(id);
    }
  };

  // Text color
  const colors = [
    "#0001FD", // 1
    "#017E00", // 2
    "#FE0000", // 3
    "#010082", // 4
    "#830003", // 5
    "#008080", // 6
    "#000000", // 7
    "#808080", // 8
  ];
  let color = "";
  if (G.cells === null || G.cells[id] === 0) color = "";
  else if (G.cells[id] > 8) color = colors[7];
  else color = colors[Number(G.cells[id]) - 1];

  if (G.cells === null || G.knownCells === null) {
    value = "";
  } else if (ctx.gameover?.isWin === false && !Number.isInteger(G.cells[id])) {
    // Display pieces of gameover
    value = <img src={getPiece(String(G.cells[id]))} />;
    className += " red";
  } else if (G.knownCells[id] === true) {
    if (G.cells[id] !== 0) {
      value = String(G.cells[id]);
    }
    className += " open";
    className += isWhite ? " white" : " black";
  } else if (G.knownCells[id] !== false && G.knownCells[id] !== true) {
    value = <img src={getPiece(String(G.knownCells[id]))} />;
  }

  return (
    <td
      className={className}
      style={{ color: color, cursor: "pointer" }}
      onClick={onCellClick}
    >
      {value}
    </td>
  );
};
