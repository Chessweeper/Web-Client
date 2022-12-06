import React, { createContext, useContext, useRef, useState } from "react";
import { ActionBar } from "./ActionBar";
import { Board } from "./Board";
import { Timer, TimerRefAttributes } from "./Timer";
import { BoardPropsWithReload } from "./Client";
import { BoardHeaderButton } from "./BoardHeaderButton";

export interface BoardContextState extends BoardPropsWithReload {
  currAction: string;
  setCurrAction: (action: string) => void;
  timer: TimerRefAttributes;
}

export const BoardContext = createContext({} as BoardContextState);
export const useBoardContext = () => useContext(BoardContext);

const BoardReport = (): JSX.Element | null => {
  const { ctx, timer } = useBoardContext();

  if (ctx.gameover?.isWin == null) return null;

  const message = ctx.gameover.isWin ? "You won!" : "You lost.";
  const time = timer.getTime().toString().padStart(3, "0");
  const timeDisplay =
    time.slice(0, time.length - 2) + ":" + time.slice(time.length - 2);

  return (
    <div id="board-report">
      <h3>
        {message} {timeDisplay}
      </h3>
    </div>
  );
};

export const BoardWrapper = (props: BoardPropsWithReload): JSX.Element => {
  const [currAction, setCurrAction] = useState("");
  const [displayCover, setDisplayCover] = useState(props.G.gamemode === "p");
  const timerRef = useRef() as React.MutableRefObject<TimerRefAttributes>;

  const additionalProps: Pick<
    BoardContextState,
    "currAction" | "setCurrAction" | "timer"
  > = {
    currAction,
    setCurrAction,
    timer: timerRef.current,
  };

  // For puzzle mode, is first covered by a black cover that we must click to reveal it
  const hideCover = () => {
    setDisplayCover(false);
    timerRef.current?.start();
  };

  const numPiecesPlaced =
    props.G.knownCells?.filter((cell) => typeof cell === "string")?.length ?? 0;

  const numPiecesRemaining = props.G.count - numPiecesPlaced;

  const numPiecesRemainingDisplay =
    numPiecesRemaining < 0
      ? `-${Math.abs(numPiecesRemaining).toString().padStart(2, "0")}`
      : numPiecesRemaining.toString().padStart(3, "0");

  return (
    <BoardContext.Provider value={{ ...props, ...additionalProps }}>
      <div className="flex">
        <div id="board-shell">
          <div id="board-header" className="flex">
            <div id="board-header-controls" className="flex hor">
              <h1 className="board-header-item">{numPiecesRemainingDisplay}</h1>
              <BoardHeaderButton />
              <Timer ref={timerRef} />
            </div>
            <BoardReport />
          </div>
          <div id="board-container">
            <div>
              <Board />
              {displayCover && (
                <div id="board-cover" onClick={hideCover}>
                  <p>Click to start puzzle!</p>
                </div>
              )}
            </div>
          </div>
        </div>
        <ActionBar />
      </div>
    </BoardContext.Provider>
  );
};
