import { createContext, useContext, useRef, useState } from "react";
import { ActionBar } from "./ActionBar";
import { Board } from "./Board";
import { Popup } from "./Popup";
import { Timer } from "./Timer";

export const BoardContext = createContext({});
export const useBoardContext = () => useContext(BoardContext);

export const BoardWrapper = (props) => {
  const [currAction, setCurrAction] = useState("");
  const timerRef = useRef();
  const boardCover = useRef();

  const additionalProps = {
    currAction,
    setCurrAction,
    startTimer: () => timerRef.current?.startTimer(),
  };

  // For puzzle mode, is first covered by a black cover that we must click to reveal it
  const hideCover = () => {
    boardCover.current.classList.add("hidden");
    timerRef.current?.startTimer();
  };

  return (
    <BoardContext.Provider value={{ ...props, ...additionalProps }}>
      <Popup />
      <div className="flex">
        <Timer ref={timerRef} />
        <div id="board-container">
          <Board />
          {props.G.gamemode === "p" ? (
            <div ref={boardCover} id="board-cover" onClick={hideCover}>
              <p>Click to start puzzle!</p>
            </div>
          ) : null}
        </div>
        <ActionBar />
      </div>
    </BoardContext.Provider>
  );
};
