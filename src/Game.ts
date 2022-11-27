import { Game as BgioGame } from "boardgame.io";
import { INVALID_MOVE } from "boardgame.io/core";
import { fillPositions, generateBoard } from "./Algs";
import { Random } from "./Random";

type Cell = boolean | number | string;
// todo: replace string with a union type for pieces?

export interface SetupData {
  seed: string | null;
  pieces: Record<string, number>;
  size: number;
  count: number;
  gamemode: "c" | "p";
  difficulty: number;
  cells?: Cell[] | null;
  knownCells?: Cell[] | null;
}

export type GameState = Required<SetupData>;

function generateClassicBoard(G: GameState, id: number) {
  const random = new Random(G.seed);
  G.cells = fillPositions(generateBoard(random, id, G.pieces, G.size, G.count));
  G.knownCells = Array(G.size * G.size).fill(false);
}

function isWinCondition(G: GameState, id: number) {
  if (G.cells === null) {
    return false;
  }

  for (let i = 0; i < G.size * G.size; i++) {
    if (!Number.isInteger(G.cells[i])) {
      if (G.cells[i] !== G.knownCells?.[i] && G.cells[i] !== id) {
        return false;
      }
    } else if (G.knownCells?.[i] !== true && G.knownCells?.[i] !== false) {
      return false;
    }
  }

  return true;
}

export const Game = (setupData: SetupData): BgioGame<GameState> => ({
  setup: () => ({
    ...setupData,
    knownCells: setupData.knownCells ?? null,
    cells: setupData.cells ?? null,
  }),

  moves: {
    discoverPiece: ({ G, events }, id: number) => {
      if (G.cells === null) {
        generateClassicBoard(G, id);
      }

      // cells and knownCells will be already set or set in generateClassicBoard
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      if (G.knownCells![id] !== false || G.gamemode === "p") {
        return INVALID_MOVE;
      }

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      if (Number.isInteger(G.cells![id])) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        G.knownCells![id] = true;
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
      if (G.knownCells![id] === true) {
        return INVALID_MOVE;
      }

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      G.knownCells![id] = action;

      if (isWinCondition(G, id)) {
        events.endGame({ isWin: true });
      }
    },

    removeHint: ({ G, events }, id: number) => {
      if (
        G.knownCells?.[id] === true ||
        G.cells === null ||
        G.knownCells === null
      ) {
        return INVALID_MOVE;
      }

      G.knownCells[id] = false;

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
