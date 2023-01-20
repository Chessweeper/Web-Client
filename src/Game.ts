import { Game as BgioGame } from "boardgame.io";
import { INVALID_MOVE } from "boardgame.io/core";
import { generateClassicBoard, getMoves } from "./gen/Algs";

export interface Cell {
  value: number | string;
  attackedValue: number;
  known: boolean | string | number;
}
// todo: replace string with a union type for pieces?

export interface SetupData {
  seed: string;
  pieces: Record<string, number>;
  size: number;
  count: number;
  gamemode: "c" | "p" | "r";
  difficulty: number;
  cells?: Cell[] | null;
}

export type GameState = Required<SetupData>;

function isReverseWinCondition(G: GameState, id: number) {
  if (G.cells === null) {
    return false;
  }

  for (let i = 0; i < G.size * G.size; i++) {
    if (typeof G.cells[i].known === "number") {
      if (G.cells[i].value !== G.cells[i].known && G.cells[i].value !== id) {
        return false;
      }
    } else if (G.cells[i].known === false) {
      return false;
    }
  }

  return true;
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
      G.cells ??= generateClassicBoard(G.seed, G.pieces, G.size, G.count, id);

      if (G.cells[id].known !== false || G.gamemode === "p") {
        return INVALID_MOVE;
      }

      if (Number.isInteger(G.cells[id].value)) {
        G.cells[id].known = true;
      } else {
        events.endGame({ isWin: false });
      }
    },

    increaseCell: ({ G, events }, id: number, value: number) => {
      if (G.cells !== null) {
        if (G.cells[id].known === false) {
          G.cells[id].known = value > 0 ? value : false;
        } else if (typeof G.cells[id].known === "number") {
          const targetValue = Number(G.cells[id].known) + value;
          G.cells[id].known = targetValue === 0 ? false : targetValue;
        }

        if (isReverseWinCondition(G, id)) {
          events.endGame({ isWin: true });
        }
      }
    },

    placeHint: ({ G, events }, id: number, action: string) => {
      G.cells ??= generateClassicBoard(G.seed, G.pieces, G.size, G.count, id);

      if (G.cells[id].known === true) {
        return INVALID_MOVE;
      }

      G.cells[id].known = action;

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
