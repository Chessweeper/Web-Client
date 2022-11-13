export const Game = {
    setup: () =>
    {
        let data = Array(8 * 8).fill(null);

        return {
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