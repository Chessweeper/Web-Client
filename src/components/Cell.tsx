import { useMemo } from "react";
import { getPiece } from "../Pieces";
import { useBoardContext } from "./BoardWrapper";

interface CellProps {
  id: number;
}

export const Cell = ({ id }: CellProps): JSX.Element => {
  const { G, ctx, moves, currAction, timer } = useBoardContext();
  let className = "cell";
  let value: string | number | JSX.Element = "";

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
      if (G.cells?.[id].known === currAction) {
        moves.removeHint(id);
      } else {
        moves.placeHint(id, currAction);
      }
    } else {
      moves.discoverPiece(id);
    }
  };

  if (G.cells === null) {
    value = "";
  } else if (
    ctx.gameover?.isWin === false &&
    !Number.isInteger(G.cells[id].value)
  ) {
    // Display pieces of gameover
    value = <img src={getPiece(String(G.cells[id].value))} />;
    className += " red";
  } else if (G.cells[id].known === true) {
    if (G.cells[id].value !== 0) {
      value = Number(G.cells[id].value);
      value -= G.cells[id].attackedValue;
    }
    className += " open";
    className += isWhite ? " white" : " black";
  } else if (G.cells[id].known !== false && G.cells[id].known !== true) {
    value = <img src={getPiece(String(G.cells[id].known))} />;
  }

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
  if (typeof value === "number") {
    if (value === 0) color = "";
    else if (value > 8) color = colors[7];
    else color = colors[value - 1];
  }

  return (
    <td
      className={className}
      style={{ color: color, cursor: "pointer" }}
      onClick={onCellClick}
    >
      {value}
      {/* <span style={{ color: "purple" }}>
        {G.cells?.[id].attackedValue ?? "?"}
      </span> */}
    </td>
  );
};
