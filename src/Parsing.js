import { piecesImages } from "./Pieces";

// List of pieces we can spawn
function findGetParameter(parameterName) {
  // https://stackoverflow.com/a/5448595
  var result = null,
    tmp = [];
  location.search
    .substring(1)
    .split("&")
    .forEach(function (item) {
      tmp = item.split("=");
      if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
    });
  return result;
}

export function parseUrl() {
  // Setting everything from URL parameter
  const seed = findGetParameter("r");
  let pieces = findGetParameter("p");
  let size = findGetParameter("s");
  let count = findGetParameter("c");
  let gamemode = findGetParameter("g");
  let difficulty = findGetParameter("d");

  size = size === null ? 8 : parseInt(size);
  count = count === null ? 3 : parseInt(count);
  difficulty = difficulty === null ? -1 : parseInt(difficulty);
  if (gamemode === null) {
    gamemode = "c";
  }

  if (gamemode !== "p" && gamemode !== "c") {
    console.warn(
      `Parsing error: invalid gamemode ${gamemode}, falling back on classic`
    );
    gamemode = "c";
  }

  if (gamemode !== "p" && difficulty !== -1) {
    console.warn("Difficulty argument is ignored outside of puzzle gamemode");
  }

  if (size < 3 || size > 100) {
    // Invalid board size
    console.warn(
      `Parsing error: invalid board size ${size}, falling back on 8`
    );
    size = 8;
  }
  if (count < 1 || count >= size * size) {
    // Board size can't fit all pieces
    console.warn(
      `Parsing error: invalid piece count ${count}, falling back on 3`
    );
    count = 3;
  }

  if (
    difficulty !== -1 &&
    (difficulty < 1 || difficulty >= size * size - count)
  ) {
    console.warn(
      `Parsing error: invalid difficulty ${difficulty}, unsetting value`
    );
    difficulty = -1;
  }

  const validLetters = Object.keys(piecesImages);
  let availablePieces = {};
  if (pieces !== null) {
    let target = null;
    for (let letter of pieces) {
      if (isNaN(letter)) {
        if (target !== null) {
          availablePieces[letter.toUpperCase()] = Infinity;
        }

        if (validLetters.includes(letter.toUpperCase())) {
          target = letter.toUpperCase();
        } else {
          console.warn(
            `Parsing error: unknown piece ${letter.toUpperCase()}, value ignored`
          );
        }
      } else {
        if (target === null) {
          console.warn(`Parsing error: no piece specified, value ignored`);
        } else {
          let nb = parseInt(letter);
          if (nb > 0) {
            availablePieces[target] = nb;
            target = null;
          } else {
            console.warn(
              "Parsing error: piece count must be superior to 0, value ignored"
            );
          }
        }
      }
    }
    if (target !== null) {
      availablePieces[target.toUpperCase()] = Infinity;
    }
  }
  if (Object.keys(availablePieces).length === 0) {
    // No piece found, fallback on default value
    availablePieces = {
      R: Infinity,
      B: Infinity,
      N: Infinity,
      Q: Infinity,
    };
  }

  let maxPieceCount = Object.values(availablePieces).reduce((a, b) => a + b, 0);
  if (count > maxPieceCount) {
    console.warn(
      `Parsing error: piece limits of total ${maxPieceCount} is lower than given piece count of ${count}, piece count set to ${maxPieceCount}`
    );
    count = maxPieceCount;
  }

  // Since pawns can't spawn on the top line, we need to be careful for boards only containing them
  const isOnlyPawn = Object.keys(availablePieces).some(
    (x) => x !== "P" && x !== "D" && x !== "桂" && x !== "歩" && x !== "香"
  );
  if (isOnlyPawn && count >= size * (size - 1)) {
    console.warn(
      `Parsing error: board size of ${size} doesn't give enough space given the piece count of ${count} of the given type, falling back piece count on 3`
    );
    count = 3;
  }

  return {
    seed,
    pieces: availablePieces,
    size,
    count,
    gamemode,
    difficulty,
  };
}
