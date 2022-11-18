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

  const additionalProps = { 
    currAction, 
    setCurrAction,
    startTimer: () => timerRef.current?.startTimer(),
  }

  return (
    <BoardContext.Provider value={{ ...props, ...additionalProps }}>
      <Popup /> 
      <div className="flex">
        <Timer ref={timerRef} />
        <Board />
        <ActionBar />
      </div>
    </BoardContext.Provider>
  );
};
