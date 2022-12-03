import React, { createContext, useContext, useRef, useState } from "react";
import { ActionBar } from "./ActionBar";
import { Board } from "./Board";
import { Popup } from "./Popup";
import { Timer, TimerRefAttributes } from "./Timer";
import { BoardPropsWithReload } from "./Client";

export interface BoardContextState extends BoardPropsWithReload {
  currAction: string;
  setCurrAction: (action: string) => void;
  timer: TimerRefAttributes;
}

export const BoardContext = createContext({} as BoardContextState);
export const useBoardContext = () => useContext(BoardContext);

export const BoardWrapper = (props: BoardPropsWithReload): JSX.Element => {
  const [currAction, setCurrAction] = useState(
    props.G.gamemode === "c" ? "" : Object.keys(props.G.pieces)[0]
  );
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

  return (
    <BoardContext.Provider value={{ ...props, ...additionalProps }}>
      <Popup />
      <div className="flex">
        <Timer ref={timerRef} />
        <div id="board-container">
          <Board />
          {displayCover && (
            <div id="board-cover" onClick={hideCover}>
              <p>Click to start puzzle!</p>
            </div>
          )}
        </div>
        <ActionBar />
      </div>
    </BoardContext.Provider>
  );
};
