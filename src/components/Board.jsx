import { Fragment } from "react";
import { useBoardContext } from "./BoardWrapper";
import { Cell } from "./Cell";

export const Board = () => {
  const { G } = useBoardContext();

  const rows = [];
  for (let i = 0; i < G.size; i++) {
    const cells = [];
    for (let j = 0; j < G.size; j++) {
      const id = G.size * i + j;
      cells.push(<Cell id={id} />);
    }
    rows.push(<tr>{cells.map((cell, index) => <Fragment key={`cell${index}`}>{cell}</Fragment>)}</tr>);
  }

  return (
    <table id="board" className={G.size >= 10 ? "small" : ""}>
      <tbody>
        {rows.map((row, index) => <Fragment key={`row${index}`}>{row}</Fragment>)}
      </tbody>
    </table>
  );
};
