export function fillPositions(data) {
    let size = Math.sqrt(data.length); // Boards are always squared

    function addIfValid(xi, yi) {
        if (xi >= 0 && xi < size && yi >= 0 && yi < size && Number.isInteger(data[yi * size + xi])) {
            data[yi * size + xi]++;
        }
    }

    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            const value = data[y * size + x];
            if (!Number.isInteger(value)) {
                if (value === 'R' || value === 'Q') { // Rook movements
                    for (let yi = y - 1; yi >= 0; yi--) {
                        if (Number.isInteger(data[yi * size + x])) data[yi * size + x]++;
                        else break;
                    }
                    for (let yi = y + 1; yi < size; yi++) {
                        if (Number.isInteger(data[yi * size + x])) data[yi * size + x]++;
                        else break;
                    }
                    for (let xi = x - 1; xi >= 0; xi--) {
                        if (Number.isInteger(data[y * size + xi])) data[y * size + xi]++;
                        else break;
                    }
                    for (let xi = x + 1; xi < size; xi++) {
                        if (Number.isInteger(data[y * size + xi])) data[y * size + xi]++;
                        else break;
                    }
                }
                if (value === 'B' || value === 'Q') {
                    for (let i = 1; y - i >= 0 && x - i >= 0; i++) {
                        if (Number.isInteger(data[(y - i) * size + (x - i)])) data[(y - i) * size + (x - i)]++;
                        else break;
                    }
                    for (let i = 1; y + i < size && x + i < size; i++) {
                        if (Number.isInteger(data[(y + i) * size + (x + i)])) data[(y + i) * size + (x + i)]++;
                        else break;
                    }
                    for (let i = 1; y - i >= 0 && x + i < size; i++) {
                        if (Number.isInteger(data[(y - i) * size + (x + i)])) data[(y - i) * size + (x + i)]++;
                        else break;
                    }
                    for (let i = 1; y - i < size && x - i >= 0; i++) {
                        if (Number.isInteger(data[(y + i) * size + (x - i)])) data[(y + i) * size + (x - i)]++;
                        else break;
                    }
                }
                if (value === 'N') {
                    addIfValid(x - 2, y - 1);
                    addIfValid(x - 2, y + 1);
                    addIfValid(x + 2, y - 1);
                    addIfValid(x + 2, y + 1);
                    addIfValid(x - 1, y - 2);
                    addIfValid(x - 1, y + 2);
                    addIfValid(x + 1, y - 2);
                    addIfValid(x + 1, y + 2);
                }
                if (value === 'K') {
                    for (let yi = -1; yi <= 1; yi++) {
                        for (let xi = -1; xi <= 1; xi++) {
                            if (xi !== 0 || yi !== 0) {
                                addIfValid(x + xi, y + yi);
                            }
                        }
                    }
                }
                if (value === 'P') {
                    addIfValid(x + 1, y - 1);
                    addIfValid(x - 1, y - 1);

                    // En passant, may be too confusing?
                    /*
                    if (y === 3) {
                        if (x > 0 && Number.isInteger(data[y * size + (x - 1)]) && Number.isInteger(data[(y - 1) * size + (x - 1)])) {
                            data[y * size + (x - 1)]++;
                        }
                        if (x < (size - 1) && Number.isInteger(data[y * size + (x + 1)]) && Number.isInteger(data[(y - 1) * size + (x + 1)])) {
                            data[y * size + (x + 1)]++;
                        }
                    }
                    */
                }
                if (value === 'D') {
                    addIfValid(x + 1, y + 1);
                    addIfValid(x - 1, y + 1);
                }
            }
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
        generateBoard: ({ G }, id, pieces, size, count) => {
            let data = Array(size * size).fill(0);
            let i = count;

            let kingCount = 0;

            while (i > 0) {
                const rand = Math.floor(Math.random() * (size * size));
                if (rand !== id && Number.isInteger(data[rand])) {
                    const value = Math.floor(Math.random() * pieces.length);
                    let piece = pieces[value];

                    if (piece === 'P' && rand < size) { // Pawns shouldn't be able to spawn on the top line
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

            G.cells = fillPositions(data);
            G.knownCells = Array(size * size).fill(false)
        },

        discoverPiece: ({ G }) => {
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