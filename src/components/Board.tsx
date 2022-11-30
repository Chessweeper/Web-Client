import { Ctx } from "boardgame.io";
import { Fragment } from "react";
import { GameState } from "../Game";
import { useBoardContext } from "./BoardWrapper";
import { Cell } from "./Cell";
import { TimerRefAttributes } from "./Timer";

export interface DisconnectedBoardProps {
  G: GameState;
  ctx?: Ctx;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  moves?: Record<string, any>;
  currAction?: string;
  timer?: TimerRefAttributes;
}

export const Board = (props: DisconnectedBoardProps): JSX.Element => {
  const { size } = props.G;

  const rows: JSX.Element[] = [];
  for (let i = 0; i < size; i++) {
    const cells: JSX.Element[] = [];
    for (let j = 0; j < size; j++) {
      const id = size * i + j;
      cells.push(<Cell id={id} {...props} />);
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
    <table id="board" className={size >= 10 ? "small" : ""}>
      <tbody>
        {rows.map((row, index) => (
          <Fragment key={`row${index}`}>{row}</Fragment>
        ))}
      </tbody>
    </table>
  );
};

export const ConnectedBoard = (): JSX.Element => {
  const { G, ctx, moves, currAction, timer } = useBoardContext();

  return (
    <Board
      G={G}
      ctx={ctx}
      moves={moves}
      currAction={currAction}
      timer={timer}
    />
  );
};
