import { useEffect, useMemo } from "react";
import { getPiece } from "../Pieces";
import { useBoardContext } from "./BoardWrapper";
import "./ActionBar.css";

export const ActionBar = (): JSX.Element => {
  const { G, currAction, setCurrAction } = useBoardContext();

  const actions = useMemo(
    () => [
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
    ],
    []
  );

  const availableActions = useMemo(() => {
    const availablePieces = Object.keys(G.pieces);
    return actions.filter(
      (action) =>
        availablePieces.includes(action.ID) ||
        (action.ID === "" && G.gamemode !== "p")
    );
  }, [actions, G.pieces, G.gamemode]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.keyCode >= 49 && e.keyCode <= 57) {
        e.preventDefault();
        const index = e.keyCode - 49;
        if (index < availableActions.length) {
          setCurrAction(availableActions[index].ID);
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [availableActions, setCurrAction]);

  const actionButtons = availableActions.map((action) => {
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

  return (
    <div id="action-buttons" className="flex hor">
      {actionButtons}
    </div>
  );
};
