import { Fragment } from "react";
import { useBoardContext } from "./BoardWrapper";
import { Cell } from "./Cell";

export const Board = (): JSX.Element => {
  const { G } = useBoardContext();

  const rows: JSX.Element[] = [];
  for (let i = 0; i < G.size; i++) {
    const cells: JSX.Element[] = [];
    for (let j = 0; j < G.size; j++) {
      const id = G.size * i + j;
      cells.push(<Cell id={id} />);
    }
    rows.push(
      <tr>
        {cells.map((cell, index) => (
          <Fragment key={`cell${index}`}>{cell}</Fragment>
        ))}
      </tr>
    );
  }

  return (
    <table id="board">
      <tbody>
        {rows.map((row, index) => (
          <Fragment key={`row${index}`}>{row}</Fragment>
        ))}
      </tbody>
    </table>
  );
};
