import { Game as BgioGame } from "boardgame.io";
import { INVALID_MOVE } from "boardgame.io/core";
import { fillPositions, generateBoard, getMoves } from "./Algs";
import { Random } from "./Random";

export interface Cell {
  value: number | string;
  attackedValue: number;
  known: boolean | string;
}
// todo: replace string with a union type for pieces?

export interface SetupData {
  seed: string;
  pieces: Record<string, number>;
  size: number;
  count: number;
  gamemode: "c" | "p";
  difficulty: number;
  cells?: Cell[] | null;
}

export type GameState = Required<SetupData>;

function generateClassicBoard(G: GameState, id: number) {
  const random = new Random(G.seed);
  const filledPositions = fillPositions(
    generateBoard(
      random,
      id,
      G.pieces,
      G.size,
      G.count,
      Array(G.size * G.size).fill(0)
    )
  );
  G.cells = filledPositions.map((pos) => ({
    value: pos,
    known: false,
    attackedValue: 0,
  }));
}

function isWinCondition(G: GameState, id: number) {
  if (G.cells === null) {
    return false;
  }

  for (let i = 0; i < G.size * G.size; i++) {
    if (!Number.isInteger(G.cells[i].value)) {
      if (G.cells[i].value !== G.cells[i].known && G.cells[i].value !== id) {
        return false;
      }
    } else if (G.cells[i].known !== true && G.cells[i].known !== false) {
      return false;
    }
  }

  return true;
}

function calcAttackedCells(G: GameState) {
  if (G.cells == null) return;
  // for some reason get a possibly null warning in some places even with null check at top of function

  // Reset all values to zero
  G.cells.forEach((cell) => {
    cell.attackedValue = 0;
  });

  // Recalculate all attacked cells
  G.cells.forEach((cell, id) => {
    if (typeof cell.known === "string") {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const data = G.cells!.map((cell) => {
        if (typeof cell.known === "string") {
          return cell.known;
        } else if (typeof cell.value === "string") {
          // strip hidden pieces from data, so they do not block calculations
          return 0;
        }

        return cell.value;
      });

      const moves = getMoves(
        cell.known,
        data,
        G.size,
        id % G.size,
        Math.floor(id / G.size)
      );

      moves.forEach((move) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        G.cells![move].attackedValue++;
      });
    }
  });
}

export const Game = (setupData: SetupData): BgioGame<GameState> => ({
  setup: () => ({
    ...setupData,
    cells: setupData.cells ?? null,
  }),

  moves: {
    discoverPiece: ({ G, events }, id: number) => {
      if (G.cells === null) {
        generateClassicBoard(G, id);
      }

      // cells and knownCells will be already set or set in generateClassicBoard
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      if (G.cells![id].known !== false || G.gamemode === "p") {
        return INVALID_MOVE;
      }

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      if (Number.isInteger(G.cells![id].value)) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        G.cells![id].known = true;
      } else {
        events.endGame({ isWin: false });
      }
    },

    placeHint: ({ G, events }, id: number, action: string) => {
      if (G.cells === null) {
        generateClassicBoard(G, id);
      }

      // cells and knownCells will be already set or set in generateClassicBoard
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      if (G.cells![id].known === true) {
        return INVALID_MOVE;
      }

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      G.cells![id].known = action;

      calcAttackedCells(G);

      if (isWinCondition(G, id)) {
        events.endGame({ isWin: true });
      }
    },

    removeHint: ({ G, events }, id: number) => {
      if (G.cells === null || G.cells[id].known === true) {
        return INVALID_MOVE;
      }

      G.cells[id].known = false;

      calcAttackedCells(G);

      if (isWinCondition(G, id)) {
        events.endGame({ isWin: true });
      }
    },
  },

  turn: {
    minMoves: 1,
    maxMoves: 1,
  },
});
