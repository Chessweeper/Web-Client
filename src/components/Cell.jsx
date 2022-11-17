import { useState } from "react";
import { getPiece } from "../Pieces";
import { useBoardContext } from "./BoardWrapper";

export const Cell = ({ id }) => {
  const { G, ctx, moves, currAction } = useBoardContext();
  const [className, setClassName] = useState("cell");
  let value = "";

  const isPosWhite = (id) => {
    const y = Math.floor(id / G.size);
    const x = id % G.size;
    return (y % 2 == 0 && x % 2 == 0) || (y % 2 == 1 && x % 2 == 1)
  }

  // const getPosColor = (tileValue) => {
  //   // Text color
  //   const colors = [
  //       "#0001FD", // 1
  //       "#017E00", // 2
  //       "#FE0000", // 3
  //       "#010082", // 4
  //       "#830003", // 5
  //       "#008080", // 6
  //       "#000000", // 7
  //       "#808080", // 8
  //   ];
  //   let color = "";
  //   if (tileValue === 0) color = "";
  //   else if (tileValue > 8) color = colors[7];
  //   else color = colors[tileValue - 1];
  //   return `color: ${color};`;
  // }

  const onCellClick = (id) => {
    if (ctx.gameover) {
        return;
    }

    // todo: call start timer if not started

    if (currAction !== null && currAction !== "") {
        if (G.knownCells[id] === currAction) {
            moves.removeHint(id);
        } else {
            moves.placeHint(id, currAction);
        }
    } else {
        moves.discoverPiece(id);

        if (Number.isInteger(G.cells[id])) {
          console.log('in dis', id);
          setClassName(prev => prev + " open");

          // Board color
          const isWhite = isPosWhite(id)
          setClassName(prev => {
            console.log('in set state', prev);
            return prev + (isWhite ? " white" : " black")
          });

          // Text color
          // cell.style = this.getPosColor(this.state.G.cells[id]);
        }
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
  else color = colors[G.cells[id] - 1];

  if (G.cells === null) {
      value = "";
  } else if (ctx.gameover?.isWin === false && !Number.isInteger(G.cells[id])) { // Display pieces of gameover
      value = <img src={getPiece(G.cells[id])} />;
      if (!className.includes("red")) {
        setClassName(prev => prev + " red");
      }
  } else if (G.knownCells[id] === true && G.cells[id] !== 0) {
      value = G.cells[id];
  } else if (G.knownCells[id] !== false && G.knownCells[id] !== true) {
      value = <img src={getPiece(G.knownCells[id])} />;
  }

  return (
    <td
      className={className}
      style={{ color: color, cursor: "pointer" }}
      onClick={() => onCellClick(id)}
    >
      {value}
    </td>
  );
};