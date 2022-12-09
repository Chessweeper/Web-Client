import { Random } from "./Random";

function isValid(
  data: Array<string | number>,
  size: number,
  x: number,
  y: number
): boolean {
  return (
    x >= 0 &&
    x < size &&
    y >= 0 &&
    y < size &&
    Number.isInteger(data[y * size + x])
  );
}

function parseMove(
  dx: number,
  dy: number,
  length: number,
  constraints: number,
  data: Array<string | number>,
  size: number,
  x: number,
  y: number
): number[] {
  const moves: number[] = [];
  const orientation: number[][] = [];
  const directions = [
    [-dx, -dy], // Forward
    [dx, dy], // Backward
    [-dy, dx], // Right
    [dy, -dx], // Left
  ];
  for (const d of [-1, 1]) {
    // For pieces like knights, we need to reverse the X for each direction
    directions.forEach((dir, i) => {
      if ((constraints & (2 ** i)) === 0) {
        return;
      }
      const nrd = [dir[0], dir[1] * d];
      if (orientation.every((x) => x[0] !== nrd[0] || x[1] !== nrd[1]))
        orientation.push(nrd);
    });
  }
  for (const [yi, xi] of orientation) {
    for (let i = 1; i <= length; i++) {
      if (isValid(data, size, x + i * xi, y + i * yi))
        moves.push((y + i * yi) * size + (x + i * xi));
      else break;
    }
  }
  return moves;
}

function parseDirection(letter: string): number[] {
  switch (letter) {
    case "W":
      return [1, 0];
    case "F":
      return [1, 1];
    case "D":
      return [2, 0];
    case "N":
      return [2, 1];
    case "A":
      return [2, 2];
    case "H":
      return [3, 0];
    case "C":
      return [3, 1];
    case "Z":
      return [3, 2];
    case "G":
      return [3, 3];
  }
  return [];
}

export function parseNotation(
  notation: string,
  data: Array<string | number>,
  size: number,
  x: number,
  y: number
) {
  let str = "";
  for (let i = 0; i < notation.length; i++) {
    const s = notation[i];
    if (s === "m") {
      // For "move" only, we discard them
      i++;
    } else if (s === "c") {
      // For "capture" only, the ones we want to keep for the game
    } else {
      str += s;
    }
  }
  notation = str;

  let d: number[] = []; // Direction we are going
  let dir = null; // Letter indicating that direction
  let length = 1; // Length we are doing
  let moves: number[] = [];
  let constraints = 15;
  for (const s of notation) {
    if (s === s.toLowerCase()) {
      if (dir !== null) {
        moves = moves.concat(
          parseMove(d[0], d[1], length, constraints, data, size, x, y)
        );
        dir = null;
        length = 1;
        constraints = 15;
      }
      switch (s) {
        case "f":
          constraints = 1;
          break;
        case "b":
          constraints = 2;
          break;
        case "l":
          constraints = 8;
          break;
        case "r":
          constraints = 4;
          break;
        case "v":
          constraints = 3;
          break;
        case "s":
          constraints = 12;
          break;
      }
    } else if (dir === null) {
      d = parseDirection(s);
      dir = s;
    } else if (!isNaN(Number(s))) {
      length = parseInt(s);
    } else if (s === dir) {
      moves = moves.concat(
        parseMove(d[0], d[1], Infinity, constraints, data, size, x, y)
      );
      dir = null;
      length = 1;
      constraints = 15;
    } else {
      moves = moves.concat(
        parseMove(d[0], d[1], length, constraints, data, size, x, y)
      );
      d = parseDirection(s);
      dir = s;
      length = 1;
      constraints = 15;
    }
  }
  if (dir !== null) {
    moves = moves.concat(
      parseMove(d[0], d[1], length, constraints, data, size, x, y)
    );
  }
  return moves;
}

// https://en.wikipedia.org/wiki/Betza%27s_funny_notation
const pieceMovesCheck: Record<string, string> = {
  R: "WW",
  B: "FF",
  Q: "WWFF",
  N: "N",
  K: "WF",
  P: "fmWfcF",
  D: "bmWbcF",
  O: "WWN",
  飛: "WW",
  角: "FF",
  桂: "ffN",
  歩: "fW",
  玉: "WF",
  香: "fWW",
  銀: "FfW",
  金: "WfF",
};

export function fillPositions(
  data: Array<number | string>
): Array<number | string> {
  const size = Math.sqrt(data.length); // Boards are always squared

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const value = data[y * size + x];
      if (!Number.isInteger(value)) {
        const moves = parseNotation(
          pieceMovesCheck[String(value)],
          data,
          size,
          x,
          y
        );
        for (const move of moves) {
          (data as number[])[move]++;
        }
      }
    }
  }

  return data;
}

/**
 *
 * @param random  Random class
 * @param id      Tile ID where we must not generate a piece on
 * @param pieces  List of pieces we can use for the generation
 * @param size    Size of the board
 * @param count   Number of pieces to place
 * @param data    Initial array of data
 * @returns       Board generated with pieces
 */
export function generateBoard(
  random: Random,
  id: number,
  pieces: Record<string, number>,
  size: number,
  count: number,
  data: Array<number | string>
): Array<number | string> {
  const piecesMdf: Record<string | number, number> = {};
  for (let i = 0; i < Object.keys(pieces).length; i++) {
    const key = Object.keys(pieces)[i];
    piecesMdf[key] = pieces[key];
  }

  let i = count;
  while (i > 0) {
    const rand = Math.floor(random.next() * (size * size));
    if (rand !== id && Number.isInteger(data[rand])) {
      const value = Math.floor(random.next() * Object.keys(piecesMdf).length);
      const piece = Object.keys(piecesMdf)[value];

      if (piecesMdf[piece] === 0) {
        // We reached the amount of time we could spawn that piece
        continue;
      }

      if (
        (piece === "P" || piece === "桂" || piece === "歩" || piece === "香") &&
        rand < size
      ) {
        // Pawns shouldn't be able to spawn on the top line
        continue;
      }
      if (piece === "D" && rand >= size * (size - 1)) {
        // Pawns shouldn't be able to spawn on the top line
        continue;
      }

      data[rand] = piece;
      piecesMdf[piece]--;
      i--;
    }
  }
  return data;
}

function validateBoard(
  data: Array<string | number>,
  discovered: boolean[],
  pieces: Record<string, number>,
  size: number
) {
  const thinkData = Array(size * size).fill(0);

  // For each tile...
  for (let i = 0; i < data.length; i++) {
    if (discovered[i] || thinkData[i] !== 0) {
      // We only want the ones we don't know about and the one we didn't validate yet
      continue;
    }

    let str = "";
    for (const piece of Object.keys(pieces)) {
      // Check all pieces
      // List of all moves for the current piece
      const moves = parseNotation(
        pieceMovesCheck[piece],
        thinkData,
        size,
        i % size,
        Math.floor(i / size)
      );

      // If the piece have a move that is impossible, it means it can't be this one
      let isValid = true;
      for (const move of moves) {
        if (discovered[move] && data[move] === 0) {
          isValid = false;
          break;
        }
      }
      if (isValid) {
        str += piece;
      }
    }
    if (str !== "") {
      // We added a piece, need to revalidate the whole board
      thinkData[i] = str;
      i = -1;
    }
  }

  // Check if we are sure that only one position is possible
  let isSolved = true;
  for (let i = 0; i < data.length; i++) {
    if (
      !discovered[i] &&
      ((Number.isInteger(data[i]) && thinkData[i] !== 0) ||
        (!Number.isInteger(data[i]) && thinkData[i] !== data[i]))
    ) {
      isSolved = false;
      break;
    }
  }

  return {
    isSolved,
    thinkData,
  };
}

/**
 * Once pieces are placed on a puzzle board, we need to generate empty tiles
 * @param data Data array containing the pieces
 * @param size Size of the board
 * @param random Random class
 * @param pieces List of pieces we can place, used later for validation purpose
 * @returns Dictionary containing if the puzzle is solvable and the data array of tiles digged
 */
function digPuzzle(
  data: Array<string | number>,
  size: number,
  random: Random,
  pieces: Record<string, number>
) {
  const discovered = Array(size * size).fill(false);

  let thinkData = null;
  let isSolved = false;
  let giveup = false;

  // Generate base board
  while (!isSolved && !giveup) {
    // Get a random position that is not a piece and wasn't already taken
    const possibilities: number[] = [];
    for (let i = 0; i < data.length; i++) {
      if (
        !discovered[i] &&
        Number.isInteger(data[i]) &&
        (thinkData === null || thinkData[i] !== 0)
      ) {
        possibilities.push(i);
      }
    }
    if (possibilities.length > 0) {
      const randPos = Math.floor(random.next() * possibilities.length);
      discovered[possibilities[randPos]] = true;
    } else {
      giveup = true; // Algorithm failed with this generation, we give up
      continue;
    }

    const validation = validateBoard(data, discovered, pieces, size);
    isSolved = validation["isSolved"];
    thinkData = validation["thinkData"];
  }

  return {
    isSolved,
    discovered,
  };
}

// https://stackoverflow.com/a/41633001/6663248
function getTimeElapsed(startTime: number): number {
  const endTime = performance.now();
  let timeDiff = endTime - startTime;
  timeDiff /= 1000;

  const seconds = Math.round(timeDiff);
  return seconds;
}

export function generatePuzzleBoard(
  seed: string | null,
  pieces: Record<string, number>,
  size: number,
  count: number,
  difficulty: number
) {
  let data: Array<number | string> = [];
  let error: string | null = null;
  let discovered: boolean[] = [];

  const random = new Random(seed);

  const startTime = performance.now();

  let c = 0;
  const maxIt = 100; // Max iteration count to attempt to generate a puzzle
  const subGenMaxIt = 50; // Max iteration count to attempt to place pieces for the sub generation part
  const firstGenCount = 4; // Number of pieces we place in the first generation
  for (; c < maxIt; c++) {
    const firstCount = count > firstGenCount ? firstGenCount : count; // Generate a first board with a max of 4 pieces

    data = fillPositions(
      generateBoard(
        random,
        -1,
        pieces,
        size,
        firstCount,
        Array(size * size).fill(0)
      )
    );

    let digData = digPuzzle(data, size, random, pieces);
    let isSolved = digData["isSolved"];
    discovered = digData["discovered"];

    if (!isSolved) {
      console.log(
        `[${getTimeElapsed(
          startTime
        )}s] - Skipping unsolvabled puzzle (${firstGenCount} pieces construction, iteration n°${c})`
      );
      continue;
    }

    console.log(
      `[${getTimeElapsed(
        startTime
      )}s] - ${firstGenCount} pieces puzzle generated`
    );

    for (let i = firstCount; i < count; i++) {
      const startData = [...data]; // Original data, in case we change the puzzle and it no longer work
      for (let c2 = 0; c2 < subGenMaxIt; c2++) {
        data = [...startData];

        // We update the current data array by just adding one piece
        data = fillPositions(generateBoard(random, -1, pieces, size, 1, data));

        digData = digPuzzle(data, size, random, pieces);
        isSolved = digData["isSolved"];
        discovered = digData["discovered"];

        if (isSolved) {
          break;
        } else {
          console.log(
            `[${getTimeElapsed(startTime)}s] - Skipping unsolvabled puzzle (${
              i + 1
            } pieces construction, sub-iteration n°${c2})`
          );
        }
      }
    }

    // We try to remove tiles to match the difficulty
    if (!isSolved) {
      console.log(
        `[${getTimeElapsed(
          startTime
        )}s] - Skipping unsolvabled puzzle (iteration n°${c})`
      );
    } else {
      console.log(
        `[${getTimeElapsed(startTime)}s] - ${count} pieces puzzle generated`
      );
      for (let i = 0; i < data.length; i++) {
        if (!discovered[i]) {
          continue;
        }

        discovered[i] = false;
        const validation = validateBoard(data, discovered, pieces, size);
        if (!validation["isSolved"]) {
          discovered[i] = true;
        }
      }

      const emptyCasesAfter = discovered.filter((x) => x === false).length;

      if (difficulty !== -1 && difficulty > emptyCasesAfter) {
        console.log(
          `[${getTimeElapsed(
            startTime
          )}s] - Skipping puzzle with ${emptyCasesAfter} empty tiles`
        );
      } else {
        if (difficulty !== -1) {
          // Set tiles to adjust difficulty

          const possibleTarget = [];
          for (let i = 0; i < data.length; i++) {
            if (!discovered[i] && Number.isInteger(data[i])) {
              possibleTarget.push(i);
            }
          }
          for (let i = emptyCasesAfter; i > difficulty; i--) {
            const rand = Math.floor(random.next() * possibleTarget.length);
            discovered[possibleTarget[rand]] = true;
            possibleTarget.splice(rand, 1).indexOf(rand);
          }
        }
        console.log(
          `[${getTimeElapsed(startTime)}s] - Generated solved puzzle with ${
            discovered.filter((x) => x === false).length
          } empty tiles`
        );
        break;
      }
    }
  }

  let cells;
  if (c === maxIt) {
    error = "Failed to generate puzzle";
  } else {
    cells = data.map((item) => ({
      value: item,
      known: false,
      attackedValue: 0,
    }));

    for (const i in discovered) {
      if (discovered[i]) {
        cells[i].known = true;
      }
    }
  }

  return { cells, error };
}
