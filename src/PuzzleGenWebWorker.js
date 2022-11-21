import { generatePuzzleBoard } from "./Algs";
import { Random } from "./Random";

onmessage = (e) => {
  const { seed, pieces, size, count, difficulty } = e.data;

  const random = new Random();
  if (seed != null) {
    function getHashCode(value) { // https://stackoverflow.com/a/7616484
        var hash = 0,
            i, chr;
        if (value.length === 0) return hash;
        for (i = 0; i < value.length; i++) {
            chr = value.charCodeAt(i);
            hash = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    }
    random.setSeed(getHashCode(seed));
  }

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