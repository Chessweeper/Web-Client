export const Game = {
    setup: () =>
    {
        let data = Array(8 * 8).fill(0);
        let knownData = Array(8 * 8).fill(false);

        let i = 3;
        while (i > 0) {
            const rand = Math.floor(Math.random() * 64);
            if (Number.isInteger(data[rand])) {
                data[rand] = 'r';
                i--;
            }
        }

        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                const value = data[y * 8 + i];
                if (!Number.isInteger(value)) {
                    if (value === 'r') { // Rook
                        console.log(y - 1);
                        for (let yi = y - 1; yi >= 0; yi--) {
                            if (Number.isInteger(data[yi * 8 + i])) data[yi * 8 + i]++;
                            else break;
                        }
                        for (let yi = y + 1; yi < 8; yi++) {
                            if (Number.isInteger(data[yi * 8 + i])) data[yi * 8 + i]++;
                            else break;
                        }
                    }
                }
            }
        }

        // Debug display the grid
        let str = "";
        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                str += data[y * 8 + x];
            }
            str += "\n";
        }
        console.log(str);

        return {
            knownCells: knownData,
            cells: data
        };
    },
  
    moves: {
        movePiece: (G, ctx, id) => {
            console.log("click")
        }
    },

    turn: {
        minMoves: 1,
        maxMoves: 1,
    }
};