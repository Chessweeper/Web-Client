import { INVALID_MOVE } from "boardgame.io/core";
import { fillPositions, generateBoard } from "./Algs";

function isWinCondition(G, id) {
    if (G.cells === null) {
        return false;
    }

    for (let i = 0; i < G.size * G.size; i++) {
        if (!Number.isInteger(G.cells[i])) {
            if (G.cells[i] !== G.knownCells[i] && G.cells[i] !== id) {
                return false;
            }
        }
        else if (G.knownCells[i] !== true && G.knownCells[i] !== false) {
            return false;
        }
    }

    return true;
}

export const Game = setupData => ({
    setup: () => ({
        ...setupData,
        knownCells: setupData.knownCells ?? null,
        cells: setupData.cells ?? null
    }),

    moves: {
        discoverPiece: ({ G, events }, id) => {
            if (G.cells === null) {
                G.cells = fillPositions(generateBoard(id, G.pieces, G.size, G.count));
                G.knownCells = Array(G.size * G.size).fill(false)
            }

            if (G.knownCells[id] !== false || G.gamemode === 'p') {
                return INVALID_MOVE;
            }

            if (Number.isInteger(G.cells[id])) {
                G.knownCells[id] = true;
            } else {
                events.endGame({ isWin: false });
            }
        },

        placeHint: ({ G, events }, id, action) => {
            if (G.cells === null) {
                G.cells = fillPositions(generateBoard(id, G.pieces, G.size, G.count));
                G.knownCells = Array(G.size * G.size).fill(false);
            }

            if (G.knownCells[id] === true) {
                return INVALID_MOVE;
            }

            G.knownCells[id] = action;

            if (isWinCondition(G, id)) {
                events.endGame({ isWin: true });
            }
        },

        removeHint: ({ G, events }, id) => {
            if (G.knownCells[id] === true) {
                return INVALID_MOVE;
            }

            G.knownCells[id] = false;

            if (isWinCondition(G, id)) {
                events.endGame({ isWin: true });
            }
        }
    },

    turn: {
        minMoves: 1,
        maxMoves: 1,
    }
});