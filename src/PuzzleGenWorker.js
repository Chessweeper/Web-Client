import { generatePuzzleBoard } from "./Algs";

onmessage = (e) => {
  const { seed, pieces, size, count, difficulty } = e.data;

  const { cells, knownCells, error } = generatePuzzleBoard(
    seed,
    pieces,
    size,
    count,
    difficulty
  );

  if (error) {
    postMessage(error);
  } else {
    postMessage({ cells, knownCells });
  }
};
