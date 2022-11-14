export function prepareBoard() {
    let knownData = Array(8 * 8).fill(false);

    return {
        knownCells: knownData,
        cells: null
    };
}

export function fillPositions(data) {
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
                    function addIfValid(xi, yi) {
                        if (xi >= 0 && xi < 8 && yi >= 0 && yi < 8 && Number.isInteger(data[yi * 8 + xi])) {
                            data[yi * 8 + xi]++;
                        }
                    }

                    addIfValid(x - 2, y - 1);
                    addIfValid(x - 2, y + 1);
                    addIfValid(x + 2, y - 1);
                    addIfValid(x + 2, y + 1);
                    addIfValid(x - 1, y - 2);
                    addIfValid(x - 1, y + 2);
                    addIfValid(x + 1, y - 2);
                    addIfValid(x + 1, y + 2);
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
        discoverPiece: ({ G }, id) => {
            if (G.cells === null) {
                let data = Array(8 * 8).fill(0);
                let i = 3;
                while (i > 0) {
                    const rand = Math.floor(Math.random() * 64);
                    if (rand !== id && Number.isInteger(data[rand])) {
                        const value = Math.floor(Math.random() * 4);
                        let piece = '';
                        if (value === 0) piece = 'R';
                        else if (value === 1) piece = 'B';
                        else if (value === 2) piece = 'Q';
                        else if (value === 3) piece = 'N';
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