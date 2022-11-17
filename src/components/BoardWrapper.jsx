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

  // todo generate puzzle board
  // useEffect(() => {
  //   if (G.gamemode === 'p') {
  //     if (G.knownCells === null) { // Failed to generate a board
  //         this.client.events.endGame({ error: "Failed to generate a board" });
  //     } else {
  //         const cells = this.rootElement.querySelectorAll('.cell');
  //         cells.forEach(cell => {
  //             const id = parseInt(cell.dataset.id);
  
  //             if (this.state.G.knownCells[id]) {
  //                 const isWhite = this.isPosWhite(id)
  //                 cell.classNameList.add("open");
  //                 cell.classNameList.add(isWhite ? "white" : "black");
  //                 cell.style = this.getPosColor(this.state.G.cells[id]);
  //             }
  //         });
  //     }
  //   }
  // }, []);

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
