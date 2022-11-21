import { generatePuzzleBoard } from "./Game";
import { Random } from "./Random";

onmessage = (e) => {
  const { seed, pieces, size, count, difficulty } = e.data;

  const random = new Random(seed);

  const { data, discovered, error } = generatePuzzleBoard(random, pieces, size, count, difficulty);

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