import { INVALID_MOVE } from "boardgame.io/dist/cjs/core.js";

function isValid(data, size, x, y) {
    return x >= 0 && x < size && y >= 0 && y < size && Number.isInteger(data[y * size + x]);
}

export function RookMoves(data, size, x, y) {
    let moves = [];
    for (let yi = y - 1; yi >= 0; yi--) {
        if (Number.isInteger(data[yi * size + x])) moves.push(yi * size + x);
        else break;
    }
    for (let yi = y + 1; yi < size; yi++) {
        if (Number.isInteger(data[yi * size + x])) moves.push(yi * size + x);
        else break;
    }
    for (let xi = x - 1; xi >= 0; xi--) {
        if (Number.isInteger(data[y * size + xi])) moves.push(y * size + xi);
        else break;
    }
    for (let xi = x + 1; xi < size; xi++) {
        if (Number.isInteger(data[y * size + xi])) moves.push(y * size + xi);
        else break;
    }
    return moves;
}

export function BishopMoves(data, size, x, y) {
    let moves = [];
    for (let i = 1; y - i >= 0 && x - i >= 0; i++) {
        if (Number.isInteger(data[(y - i) * size + (x - i)])) moves.push((y - i) * size + (x - i));
        else break;
    }
    for (let i = 1; y + i < size && x + i < size; i++) {
        if (Number.isInteger(data[(y + i) * size + (x + i)])) moves.push((y + i) * size + (x + i));
        else break;
    }
    for (let i = 1; y - i >= 0 && x + i < size; i++) {
        if (Number.isInteger(data[(y - i) * size + (x + i)])) moves.push((y - i) * size + (x + i));
        else break;
    }
    for (let i = 1; y - i < size && x - i >= 0; i++) {
        if (Number.isInteger(data[(y + i) * size + (x - i)])) moves.push((y + i) * size + (x - i));
        else break;
    }
    return moves;
}

export function QueenMoves(data, size, x, y) {
    return RookMoves(data, size, x, y).concat(BishopMoves(data, size, x, y));
}

export function LanceMoves(data, size, x, y) {
    let moves = [];
    for (let yi = y - 1; yi >= 0; yi--) {
        if (Number.isInteger(data[yi * size + x])) moves.push(yi * size + x);
        else break;
    }
    return moves;
}

export function KnightMoves(data, size, x, y) {
    let moves = [];
    if (isValid(data, size, x - 2, y - 1)) moves.push((y - 1) * size + (x - 2));
    if (isValid(data, size, x - 2, y + 1)) moves.push((y + 1) * size + (x - 2));
    if (isValid(data, size, x + 2, y - 1)) moves.push((y - 1) * size + (x + 2));
    if (isValid(data, size, x + 2, y + 1)) moves.push((y + 1) * size + (x + 2));
    if (isValid(data, size, x - 1, y - 2)) moves.push((y - 2) * size + (x - 1));
    if (isValid(data, size, x - 1, y + 2)) moves.push((y + 2) * size + (x - 1));
    if (isValid(data, size, x + 1, y - 2)) moves.push((y - 2) * size + (x + 1));
    if (isValid(data, size, x + 1, y + 2)) moves.push((y + 2) * size + (x + 1));
    return moves;
}

export function ShogiKnightMoves(data, size, x, y) {
    let moves = [];
    if (isValid(data, size, x - 1, y - 2)) moves.push((y - 2) * size + (x - 1));
    if (isValid(data, size, x + 1, y - 2)) moves.push((y - 2) * size + (x + 1));
    return moves;
}

export function KnookMoves(data, size, x, y) {
    return KnightMoves(data, size, x, y).concat(RookMoves(data, size, x, y));
}

export function KingMoves(data, size, x, y) {
    let moves = [];
    for (let yi = -1; yi <= 1; yi++) {
        for (let xi = -1; xi <= 1; xi++) {
            if (xi !== 0 || yi !== 0) {
                if (isValid(data, size, x + xi, y + yi)) moves.push((y + yi) * size + (x + xi));
            }
        }
    }
    return moves;
}

export function PawnMoves(data, size, x, y) {
    let moves = [];
    if (isValid(data, size, x + 1, y - 1)) moves.push((y - 1) * size + (x + 1));
    if (isValid(data, size, x - 1, y - 1)) moves.push((y - 1) * size + (x - 1));
    return moves;
}

export function ShogiPawnMoves(data, size, x, y) {
    let moves = [];
    if (isValid(data, size, x, y - 1)) moves.push((y - 1) * size + x);
    return moves;
}

export function BlackPawnMoves(data, size, x, y) {
    let moves = [];
    if (isValid(data, size, x + 1, y + 1)) moves.push((y + 1) * size + (x + 1));
    if (isValid(data, size, x - 1, y + 1)) moves.push((y + 1) * size + (x - 1));
    return moves;
}

export function SilverGeneralMoves(data, size, x, y) {
    let moves = [];
    if (isValid(data, size, x + 1, y - 1)) moves.push((y - 1) * size + (x + 1));
    if (isValid(data, size, x, y - 1)) moves.push((y - 1) * size + x);
    if (isValid(data, size, x - 1, y - 1)) moves.push((y - 1) * size + (x - 1));
    if (isValid(data, size, x - 1, y + 1)) moves.push((y + 1) * size + (x - 1));
    if (isValid(data, size, x + 1, y + 1)) moves.push((y + 1) * size + (x + 1));
    return moves;
}

export function GoldGeneralMoves(data, size, x, y) {
    let moves = [];
    if (isValid(data, size, x + 1, y - 1)) moves.push((y - 1) * size + (x + 1));
    if (isValid(data, size, x, y - 1)) moves.push((y - 1) * size + x);
    if (isValid(data, size, x - 1, y - 1)) moves.push((y - 1) * size + (x - 1));
    if (isValid(data, size, x - 1, y)) moves.push(y * size + (x - 1));
    if (isValid(data, size, x + 1, y)) moves.push(y * size + (x + 1));
    if (isValid(data, size, x, y + 1)) moves.push((y + 1) * size + x);
    return moves;
}

const pieceMovesCheck = {
    'R': RookMoves,
    'B': BishopMoves,
    'Q': QueenMoves,
    'N': KnightMoves,
    'K': KingMoves,
    'P': PawnMoves,
    'D': BlackPawnMoves,
    'O': KnookMoves,
    '飛': RookMoves,
    '角': BishopMoves,
    '桂': ShogiKnightMoves,
    '歩': ShogiPawnMoves,
    '玉': KingMoves,
    '香': LanceMoves,
    '銀': SilverGeneralMoves,
    '金': GoldGeneralMoves
}

export function fillPositions(data) {
    let size = Math.sqrt(data.length); // Boards are always squared

    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            const value = data[y * size + x];
            if (!Number.isInteger(value)) {
                let moves = pieceMovesCheck[value](data, size, x, y);
                for (let move of moves) {
                    data[move]++;
                }
            }
        }
    }
    
    return data;
}

export function generateBoard(random, id, pieces, size, count) {
    let piecesMdf = {};
    for (let key in pieces) {
        piecesMdf[key] = pieces[key];
    }

    let data = Array(size * size).fill(0);
    let i = count;
    while (i > 0) {
        const rand = Math.floor(random.Number() * (size * size));
        if (rand !== id && Number.isInteger(data[rand])) {
            const value = Math.floor(random.Number() * Object.keys(piecesMdf).length);
            let piece = Object.keys(piecesMdf)[value];

            if (piecesMdf[piece] === 0) { // We reached the amount of time we could spawn that piece
                continue;
            }

            if ((piece === 'P' || piece === '桂' || piece === '歩' || piece === '香') && rand < size) { // Pawns shouldn't be able to spawn on the top line
                continue;
            }
            if (piece === 'D' && rand >= (size * (size - 1))) { // Pawns shouldn't be able to spawn on the top line
                continue;
            }

            data[rand] = piece;
            piecesMdf[piece]--;
            i--;
        }
    }
    return data;
}

function validateBoard(data, discovered, pieces, size) {
    let thinkData = Array(size * size).fill(0);

    // For each tile...
    for (let i = 0; i < data.length; i++) {
        if (discovered[i] || thinkData[i] !== 0) { // We only want the ones we don't know about and the one we didn't validate yet
            continue;
        }

        let str = "";
        for (let piece of Object.keys(pieces)) // Check all pieces
        {
            // List of all moves for the current piece
            let moves = pieceMovesCheck[piece](thinkData, size, i % size, Math.floor(i / size));

            // If the piece have a move that is impossible, it means it can't be this one
            let isValid = true;
            for (let move of moves) {
                if (discovered[move] && data[move] === 0) {
                    isValid = false;
                    break;
                }
            }
            if (isValid) {
                str += piece;
            }
        }
        if (str !== "") { // We added a piece, need to revalidate the whole board
            thinkData[i] = str;
            i = -1;
        }
    }

    // Check if we are sure that only one position is possible
    let isSolved = true;
    for (let i = 0; i < data.length; i++) {
        if (!discovered[i] &&
            ((Number.isInteger(data[i]) && thinkData[i] !== 0) ||
                (!Number.isInteger(data[i]) && thinkData[i] !== data[i]))) {
            isSolved = false;
            break;
        }
    }

    return {
        isSolved: isSolved,
        thinkData: thinkData
    };
}

function generatePuzzleBoard(random, pieces, size, count, difficulty) {
    let data;
    let discovered;
    let hasError = false;

    let c = 0;
    const maxIt = 300;
    for (; c < maxIt; c++)
    {
        data = fillPositions(generateBoard(random, -1, pieces, size, count));
        discovered = Array(size * size).fill(false);

        let thinkData = null;
        let isSolved = false;
        let giveup = false;
        while (!isSolved && !giveup) {
            // Get a random position that is not a piece and wasn't already taken
            let possibilities = [];
            for (let i in data) {
                if (!discovered[i] && Number.isInteger(data[i]) && (thinkData === null || thinkData[i] !== 0)) {
                    possibilities.push(i);
                }
            }
            if (possibilities.length > 0) {
                let randPos = Math.floor(random.Number() * possibilities.length);
                discovered[possibilities[randPos]] = true;
            } else {
                giveup = true; // Algorithm failed with this generation, we give up
                continue;
            }

            let validation = validateBoard(data, discovered, pieces, size);
            isSolved = validation["isSolved"];
            thinkData = validation["thinkData"];
        }

        if (!isSolved) {
            console.log("Skipping unsolvabled puzzle");
        } else {
            for (let i = 0; i < data.length; i++) {
                if (!discovered[i]) {
                    continue;
                }

                discovered[i] = false;
                let validation = validateBoard(data, discovered, pieces, size);
                if (!validation["isSolved"]) {
                    discovered[i] = true;
                }
            }

            let emptyCasesAfter = discovered.filter(x => x === false).length;

            if (difficulty !== -1 && difficulty > emptyCasesAfter) {
                console.log(`Skipping puzzle with ${emptyCasesAfter} empty tiles`);
            } else {
                if (difficulty !== -1) {
                    // Set tiles to adjust difficulty

                    let possibleTarget = [];
                    for (let i = 0; i < data.length; i++) {
                        if (!discovered[i] && Number.isInteger(data[i])) {
                            possibleTarget.push(i);
                        }
                    }
                    for (let i = emptyCasesAfter; i > difficulty; i--) {
                        const rand = Math.floor(random.Number() * possibleTarget.length);
                        discovered[possibleTarget[rand]] = true;
                        possibleTarget.splice(rand, 1).indexOf(rand);
                    }
                }
                console.log(`Generated solved puzzle with ${discovered.filter(x => x === false).length} empty tiles`);
                break;
            }
        }
    }

    if (c === maxIt) {
        hasError = true;
    }

    return { data, discovered, hasError };
}

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
    setup: ({ events, random }) => {
        const { gamemode, pieces, size, count, difficulty } = setupData;
        let knownCells = null;
        let cells = null;

        if (gamemode === 'p') {
            const { data, discovered, hasError } = generatePuzzleBoard(random, pieces, size, count, difficulty);
            if (!hasError) {
                cells = data;
                knownCells = Array(size * size).fill(false);

                for (let i in discovered) {
                    if (discovered[i]) {
                        knownCells[i] = true;
                    }
                }
            }
        }

        return {
            ...setupData,
            knownCells,
            cells
        };
    },

    moves: {
        discoverPiece: ({ G, random, events }, id) => {
            if (G.cells === null) {
                G.cells = fillPositions(generateBoard(random, id, G.pieces, G.size, G.count));
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