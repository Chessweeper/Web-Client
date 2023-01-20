import { useMemo } from "react";
import { getPiece } from "../Pieces";
import { useAppSelector } from "../store";
import { useBoardContext } from "./BoardWrapper";
import "./Cell.css";

interface CellProps {
  id: number;
}

export const Cell = ({ id }: CellProps): JSX.Element => {
  const { G, ctx, moves, currAction, timer } = useBoardContext();
  const isAttackedCellValuesEnabled = useAppSelector(
    (s) => s.settings.isAttackedCellValuesEnabled
  );

  let value: string | number | JSX.Element = "";

  let className = "cell";
  if (G.size > 10) {
    className += " small";
  }

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

    if (currAction === "shovel") {
      moves.discoverPiece(id);
    } else if (currAction === "plus") {
      console.log("TODO");
    } else if (currAction === "minus") {
      console.log("TODO");
    } else {
      if (G.cells?.[id].known === currAction) {
        moves.removeHint(id);
      } else {
        moves.placeHint(id, currAction);
      }
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
    value = Number(G.cells[id].value);
    if (isNaN(value)) {
      value = <img src={getPiece(String(G.cells[id].value))} />;
    } else {
      if (isAttackedCellValuesEnabled) {
        value -= G.cells[id].attackedValue;
      }
      if (value === 0 && G.cells[id].value === 0) {
        value = "";
      }
    }
    if (typeof value === "number" && value < 0) {
      className += " red";
    } else {
      className += " open";
      className += isWhite ? " white" : " black";
    }
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
    else if (value < 0) color = "white";
    else color = colors[value - 1];
  }

  return (
    <td
      className={className}
      style={{ color: color, cursor: "pointer" }}
      onClick={onCellClick}
    >
      {typeof value === "number" ? value.toString() : value}
    </td>
  );
};
