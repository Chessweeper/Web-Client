import { createContext, useContext, useState } from "react";
import { ActionBar } from "./ActionBar";
import { Board } from "./Board";
import { Popup } from "./Popup";
import { Timer } from "./Timer";

const BoardContext = createContext({});
export const useBoardContext = () => useContext(BoardContext);

export const BoardWrapper = (props) => {
  const [currAction, setCurrAction] = useState("");

  const additionalProps = { currAction, setCurrAction }

  return (
    <BoardContext.Provider value={{ ...props, ...additionalProps }}>
      <Popup /> 
      <div className="flex">
        <Timer />
        <Board />
        <ActionBar />
      </div>
    </BoardContext.Provider>
  );
};
