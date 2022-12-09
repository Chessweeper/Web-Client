import { generatePuzzleBoard } from "./Algs";
import { SetupData } from "./Game";

onmessage = (e) => {
  const { seed, pieces, size, count, difficulty } = e.data as SetupData;

  const { cells, error } = generatePuzzleBoard(
    seed,
    pieces,
    size,
    count,
    difficulty
  );

  if (error) {
    postMessage(error);
  } else {
    postMessage({ cells });
  }
};
