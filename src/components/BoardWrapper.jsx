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
  }

  const needsPuzzleGeneration = props.G.gamemode === 'p' && props.G.cells === null;

  const generatePuzzleBoard = () => {
    if (needsPuzzleGeneration) {
      props.moves.generatePuzzleBoard();
    }
  }

  useEffect(() => {
    window.addEventListener('load', generatePuzzleBoard);

    return () => {
      window.removeEventListener('load', generatePuzzleBoard);
    }
  }, []);

  if (needsPuzzleGeneration) {
    return <div>Generating Board...</div>;
  }

  // For puzzle mode, is first covered by a black cover that we must click to reveal it
  const hideCover = () => {
    document.getElementById("board-cover").hidden = true;
    timerRef.current?.startTimer();
  }

  return (
    <BoardContext.Provider value={{ ...props, ...additionalProps }}>
      <Popup /> 
      <div className="flex">
        <Timer ref={timerRef} />
        <div id="board-container">
          <Board />
          {props.G.gamemode === 'p' ?
            <div id="board-cover" onClick={hideCover}>
              Click to start puzzle!
            </div>
            : null}
        </div>
        <ActionBar />
      </div>
    </BoardContext.Provider>
  );
};
