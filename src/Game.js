
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

export function generateBoard(id, pieces, size, count) {
    let data = Array(size * size).fill(0);
    let i = count;

    let kingCount = 0;

    while (i > 0) {
        const rand = Math.floor(Math.random() * (size * size));
        if (rand !== id && Number.isInteger(data[rand])) {
            const value = Math.floor(Math.random() * pieces.length);
            let piece = pieces[value];

            if ((piece === 'P' || piece === '桂' || piece === '歩' || piece === '香') && rand < size) { // Pawns shouldn't be able to spawn on the top line
                continue;
            }
            if (piece === 'D' && rand >= (size * (size - 1))) { // Pawns shouldn't be able to spawn on the top line
                continue;
            }
            if (piece === 'K' && kingCount === 1) { // Can't have 2 kings
                continue;
            }

            if (piece === 'K') {
                kingCount++;
            }
            data[rand] = piece;
            i--;
        }
    }
    return data;
}

export const Game = {
    setup: () => {
        return {
            knownCells: null,
            cells: null
        };
    },
  
    moves: {
        generatePuzzleBoard: ({ G }, pieces, size, count) => {
            let bestPuzzle = null;

            for (let c = 0; c < 10; c++)
            {
                let data = fillPositions(generateBoard(-1, pieces, size, count));
                let discovered = Array(size * size).fill(false);

                let thinkData = null;
                let it = 0;
                let isSolved = false;
                while (!isSolved && it < 1000) {
                    it++; // After 1000 iterations we just give up

                    // Get a random position that is not a piece and wasn't already taken
                    let possibilities = [];
                    for (let i in data) {
                        if (!discovered[i] && Number.isInteger(data[i]) && (thinkData === null || thinkData[i] !== 0)) {
                            possibilities.push(i);
                        }
                    }
                    if (possibilities.length > 0) {
                        let randPos = Math.floor(Math.random() * possibilities.length);
                        discovered[possibilities[randPos]] = true;
                    } else {
                        it = 1000; // Algorithm failed with this generation, we give up
                        continue;
                    }

                    thinkData = Array(size * size).fill(0);

                    // For each tile...
                    for (let i = 0; i < data.length; i++) {
                        if (discovered[i]) { // We only want the ones we don't know about
                            continue;
                        }

                        let str = "";
                        for (let piece of pieces) // Check all pieces
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
                        thinkData[i] = str;
                    }

                    // Check if we are sure that only one position is possible
                    isSolved = true;
                    for (let i = 0; i < data.length; i++) {
                        if (!discovered[i] &&
                            ((Number.isInteger(data[i]) && thinkData[i] !== "") ||
                                (!Number.isInteger(data[i]) && thinkData[i] !== data[i]))) {
                            isSolved = false;
                            break;
                        }
                    }
                }

                let emptyCases = discovered.filter(x => x === false).length;
                console.log(`Generated ${isSolved ? "" : "un"}solved puzzle with ${emptyCases} empty cases after ${it} iterations`);

                let isBetter = bestPuzzle === null || (isSolved && !bestPuzzle["isSolved"]) || emptyCases > bestPuzzle["emptyCases"];
                if (isBetter) {
                    bestPuzzle = {
                        "emptyCases": emptyCases,
                        "data": data,
                        "discovered": discovered,
                        "isSolved": isSolved
                    }
                }
            }

            G.cells = bestPuzzle["data"];
            G.knownCells = Array(size * size).fill(false);

            for (let i in bestPuzzle["discovered"]) {
                if (bestPuzzle["discovered"][i]) {
                    G.knownCells[i] = true;
                }
            }
        },

        generateBoard: ({ G }, id, pieces, size, count) => {
            G.cells = fillPositions(generateBoard(id, pieces, size, count));
            G.knownCells = Array(size * size).fill(false)
        },

        discoverPiece: ({ G }, id) => {
            G.knownCells[id] = true;
        },

        placeHint: ({ G }, id, action) => {
            G.knownCells[id] = action;
        },

        removeHint: ({ G }, id) => {
            G.knownCells[id] = false;
        }
    },

    turn: {
        minMoves: 1,
        maxMoves: 1,
    }
};