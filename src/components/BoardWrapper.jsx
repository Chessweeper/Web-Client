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
  let [displayCover, setDisplayCover] = useState(props.G.gamemode === "p");

  const additionalProps = {
    currAction,
    setCurrAction,
    startTimer: () => timerRef.current?.startTimer(),
  };

  // For puzzle mode, is first covered by a black cover that we must click to reveal it
  const hideCover = () => {
    setDisplayCover(false);
    timerRef.current?.startTimer();
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
