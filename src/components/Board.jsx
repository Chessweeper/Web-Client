import { useBoardContext } from "./BoardWrapper";
import { Cell } from "./Cell";

export const Board = () => {
//   // Method used for the timer
//   this.timer = null;
//   this.currTime = 0;
//   this.timerDiv = document.getElementById("timer");

//   // Generate board for puzzle gamemode

//   console.log(`Game loaded: ${setupData.gamemode === 'c' ? "classNameic" : "puzzle"} gamemode${seed != null ? ` with a seed of \"${seed}\"` : ""}, ${setupData.count} piece${setupData.count > 1 ? "s" : ""}, ${setupData.size}x${setupData.size} grid, piece${Object.keys(setupData.pieces).length > 1 ? "s" : ""} allowed: ${Object.keys(setupData.pieces).map(x => `${x} (x${setupData.pieces[x]})`).join(', ')}`)
// }

  const { G } = useBoardContext();

  const rows = [];
  for (let i = 0; i < G.size; i++) {
    const cells = [];
    for (let j = 0; j < G.size; j++) {
      const id = G.size * i + j;
      cells.push(<Cell id={id} />);
    }
    rows.push(<tr>{cells.map((cell) => cell)}</tr>);
  }
  const cells = <table>{rows.map((row) => row)}</table>;

  return (
    <>
      <div id="app">Generating board...</div>
      {cells}
    </>
  );
};
