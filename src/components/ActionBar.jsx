import { useMemo } from "react";
import { getPiece } from '../Pieces';
import { useBoardContext } from "./BoardWrapper";

export const ActionBar = () => {
  const { G, currAction, setCurrAction } = useBoardContext();

  const availablePieces = Object.keys(G.pieces);

  const actions = useMemo(() => [
    { ID: "", name: "Shovel" },
    { ID: "R", name: "Rook" },
    { ID: "B", name: "Bishop" },
    { ID: "N", name: "Knight" },
    { ID: "O", name: "Knook" },
    { ID: "Q", name: "Queen" },
    { ID: "P", name: "Pawn" },
    { ID: "D", name: "Black Pawn" },
    { ID: "K", name: "King" },
    { ID: "飛", name: "Shogi Rook" },
    { ID: "角", name: "Shogi Bishop" },
    { ID: "桂", name: "Shogi Knight" },
    { ID: "歩", name: "Shogi Pawn" },
    { ID: "玉", name: "Shogi King" },
    { ID: "香", name: "Shogi Lance" },
    { ID: "銀", name: "Shogi Silver General" },
    { ID: "金", name: "Shogi Gold General" },
  ], []);

  const actionButtons = actions
    .filter((action) => availablePieces.includes(action.ID) || (action.ID === "" && G.gamemode !== "p"))
    .map((action) => {
      let className = "action";
      if (currAction === action.ID) className += " selected";
      return (
        <button
          key={action.ID}
          className={className}
          onClick={() => setCurrAction(action.ID)}
        >
          <img src={getPiece(action.ID)} alt={action.name} />
        </button>
      );
    });


  // todo: useeffect & setCurrAction = actionButtons[0] id
  window.onkeydown = (e) => {
    if (e.keyCode >= 49 && e.keyCode <= 57) {
      e.preventDefault();
      const index = e.keyCode - 49;
      if (index < actionButtons?.length) {
        setCurrAction(actionButtons[index].key);
      }
    }
  };

  return <div>
    <p>Current Action:</p>
    <div className="flex hor">
      {actionButtons}
    </div>
  </div>
};