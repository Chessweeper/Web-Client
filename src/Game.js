export const Game = {
    setup: () =>
    {
        let data = Array(8 * 8).fill(0);
        let knownData = Array(8 * 8).fill(false);

        let i = 3;
        while (i > 0) {
            const rand = Math.floor(Math.random() * 64);
            if (Number.isInteger(data[rand])) {
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
                        const positions = [
                            [x - 1, y - 2],
                            [x - 1, y + 2],
                            [x + 1, y - 2],
                            [x + 1, y + 2],
                            [x - 2, y - 1],
                            [x - 2, y + 1],
                            [x + 2, y - 1],
                            [x + 2, y + 1],
                        ];
                        for (const [x, y] of positions) {
                            if (x < 0 || x >= 8 || y < 0 || y >= 8) continue;
                            if (Number.isInteger(data[y * 8 + x])) data[y * 8 + x]++;
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

        return {
            knownCells: knownData,
            cells: data,
            targetCount: i
        };
    },
  
    moves: {
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
