import { createContext, useContext, useState } from "react";
import { ActionBar } from "./ActionBar";
import { Board } from "./Board";
import { Popup } from "./Popup";

const BoardContext = createContext({});
export const useBoardContext = () => useContext(BoardContext);

export const BoardWrapper = (props) => {
  const { ctx } = props;
  const [currAction, setCurrAction] = useState("");

  let popupMessage;
  if (ctx.gameover?.error) {
    popupMessage = state.ctx.gameover.error;
  } else if (ctx.gameover?.isWin) {
    popupMessage = state.ctx.gameover.isWin ? 'You won' : 'You lost';
  }

  return (
    <BoardContext.Provider value={{ ...props, currAction, setCurrAction }}>
      { popupMessage && <Popup text={popupMessage} /> }
      <div className="flex">
        <div id="timer">0:00</div>
        <Board />
        <ActionBar />
      </div>
    </BoardContext.Provider>
  );
};
