export const Game = {
    setup: () =>
    {
        let data = Array(8 * 8).fill(null);
        let knownData = Array(8 * 8).fill(false);

        let i = 3;
        while (i > 3) {
            const rand = Math.floor(Math.random() * 64);
            if (data[rand !== null]) {
                data[rand] = 1;
                i--;
            }
        }

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