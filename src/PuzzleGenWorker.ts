import { generatePuzzleBoard } from "./Algs";
import { SetupData } from "./Game";

onmessage = (e: MessageEvent<SetupData>) => {
  const { seed, pieces, size, count, difficulty } = e.data;

  const updateProgress = (value: number) => {
    postMessage(value);
  };

  const { cells, error } = generatePuzzleBoard(
    seed,
    pieces,
    size,
    count,
    difficulty,
    updateProgress
  );

  if (error) {
    postMessage(error);
  } else {
    postMessage({ ...e.data, cells });
  }
};
