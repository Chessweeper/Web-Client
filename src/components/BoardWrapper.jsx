import { createContext, useContext, useEffect, useRef, useState } from "react";
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
  };

  const needsPuzzleGeneration =
    props.G.gamemode === "p" && props.G.cells === null;

  useEffect(() => {
    if (needsPuzzleGeneration) {
      props.moves.generatePuzzleBoard();
    }
  }, [props.moves, needsPuzzleGeneration]);

  if (needsPuzzleGeneration) {
    return <div>Generating Board...</div>;
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
