export function prepareBoard() {
    let knownData = Array(8 * 8).fill(false);

    return {
        knownCells: knownData,
        cells: null
    };
}

export function fillPositions(data) {
    function addIfValid(xi, yi) {
        if (xi >= 0 && xi < 8 && yi >= 0 && yi < 8 && Number.isInteger(data[yi * 8 + xi])) {
            data[yi * 8 + xi]++;
        }
    }

    for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
            const value = data[y * 8 + x];
            if (!Number.isInteger(value)) {
                if (value === 'R' || value === 'Q') { // Rook movements
                    for (let yi = y - 1; yi >= 0; yi--) {
                        if (Number.isInteger(data[yi * 8 + x])) data[yi * 8 + x]++;
                        else break;
                    }
                    for (let yi = y + 1; yi < 8; yi++) {
                        if (Number.isInteger(data[yi * 8 + x])) data[yi * 8 + x]++;
                        else break;
                    }
                    for (let xi = x - 1; xi >= 0; xi--) {
                        if (Number.isInteger(data[y * 8 + xi])) data[y * 8 + xi]++;
                        else break;
                    }
                    for (let xi = x + 1; xi < 8; xi++) {
                        if (Number.isInteger(data[y * 8 + xi])) data[y * 8 + xi]++;
                        else break;
                    }
                }
                if (value === 'B' || value === 'Q') {
                    for (let i = 1; y - i >= 0 && x - i >= 0; i++) {
                        if (Number.isInteger(data[(y - i) * 8 + (x - i)])) data[(y - i) * 8 + (x - i)]++;
                        else break;
                    }
                    for (let i = 1; y + i < 8 && x + i < 8; i++) {
                        if (Number.isInteger(data[(y + i) * 8 + (x + i)])) data[(y + i) * 8 + (x + i)]++;
                        else break;
                    }
                    for (let i = 1; y - i >= 0 && x + i < 8; i++) {
                        if (Number.isInteger(data[(y - i) * 8 + (x + i)])) data[(y - i) * 8 + (x + i)]++;
                        else break;
                    }
                    for (let i = 1; y - i < 8 && x - i >= 0; i++) {
                        if (Number.isInteger(data[(y + i) * 8 + (x - i)])) data[(y + i) * 8 + (x - i)]++;
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

                    // En passant
                    if (y === 3) {
                        if (x > 0 && Number.isInteger(data[y * 8 + (x - 1)]) && Number.isInteger(data[(y - 1) * 8 + (x - 1)])) {
                            data[y * 8 + (x - 1)]++;
                        }
                        if (x < (8 - 1) && Number.isInteger(data[y * 8 + (x + 1)]) && Number.isInteger(data[(y - 1) * 8 + (x + 1)])) {
                            data[y * 8 + (x + 1)]++;
                        }
                    }
                }
            }
        }
    }

    // Debug display the grid
    /*
    let str = "";
    for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
            str += data[y * 8 + x];
        }
        str += "\n";
    }
    console.log(str);
    */
    
    return data;
}

export const Game = {
    setup: prepareBoard,
  
    moves: {
        discoverPiece: ({ G }, id, pieces) => {
            if (G.cells === null) {
                let data = Array(8 * 8).fill(0);
                let i = 3;

                while (i > 0) {
                    const rand = Math.floor(Math.random() * 64);
                    if (rand !== id && Number.isInteger(data[rand])) {
                        const value = Math.floor(Math.random() * pieces.length);
                        let piece = pieces[value];
                        data[rand] = piece;
                        i--;
                    }
                }

                G.cells = fillPositions(data);
            }

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