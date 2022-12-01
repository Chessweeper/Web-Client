import { Game as BgioGame } from "boardgame.io";
import { INVALID_MOVE } from "boardgame.io/core";
import { fillPositions, generateBoard, getstuff } from "./Algs";
import { Random } from "./Random";

interface Cell {
  value: number | string;
  attackedValue: number;
  known: boolean | string;
}

// todo: replace string with a union type for pieces?

export interface SetupData {
  seed: string | null;
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
  const filledPositions: (string | number)[] = fillPositions(
    generateBoard(random, id, G.pieces, G.size, G.count)
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

      // if setting is turned on for numbers
      const moves = getstuff(
        action,
        G.cells,
        G.size,
        id % G.size,
        Math.floor(id / G.size)
      );

      moves.forEach((move) => {
        console.log("incrementing attacked for", move);
        G.cells![move].attackedValue++;
      });

      if (isWinCondition(G, id)) {
        events.endGame({ isWin: true });
      }
    },

    removeHint: ({ G, events }, id: number) => {
      if (G.cells === null || G.cells[id].known === true) {
        return INVALID_MOVE;
      }

      const piece = G.cells[id].known;

      G.cells[id].known = false;

      // if setting is turned on for numbers
      const moves = getstuff(
        piece,
        G.cells,
        G.size,
        id % G.size,
        Math.floor(id / G.size)
      );
      moves.forEach((move) => {
        G.cells![move].attackedValue--;
      });

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
