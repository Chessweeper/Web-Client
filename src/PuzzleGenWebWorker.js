import { generatePuzzleBoard } from "./Algs";

onmessage = (e) => {
  const { pieces, size, count, difficulty } = e.data;
  const { data, discovered, error } = generatePuzzleBoard(pieces, size, count, difficulty);

  if (error) {
    postMessage(error)
  } else {
    let cells = data;
    let knownCells = Array(size * size).fill(false);
  
    for (let i in discovered) {
        if (discovered[i]) {
            knownCells[i] = true;
        }
    }

    postMessage({ cells, knownCells });
  }
}