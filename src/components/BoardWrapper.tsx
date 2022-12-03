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

  const numPiecesPlaced = props.G.knownCells?.filter(
    (cell) => typeof cell === "string"
  )?.length;

  const numPiecesRemaining = numPiecesPlaced
    ? props.G.count - numPiecesPlaced
    : props.G.count;

  const numPiecesRemainingDisplay =
    numPiecesRemaining < 0
      ? `-${Math.abs(numPiecesRemaining).toString().padStart(2, "0")}`
      : numPiecesRemaining.toString().padStart(3, "0");

  return (
    <BoardContext.Provider value={{ ...props, ...additionalProps }}>
      <div className="flex">
        <div>
          <div id="board-header" className="flex hor">
            <h1 className="board-header-item">{numPiecesRemainingDisplay}</h1>
            <BoardHeaderButton />
            <Timer ref={timerRef} />
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
