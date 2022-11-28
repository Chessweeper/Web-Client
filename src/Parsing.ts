import { SetupData } from "./Game";
import { piecesImages } from "./Pieces";

export function parseUrl(searchParams: URLSearchParams): SetupData {
  const seed = searchParams.get("r");
  const pieces = searchParams.get("p");
  const sizeParam = searchParams.get("s");
  const countParam = searchParams.get("c");
  let gamemode = searchParams.get("g");
  const difficultyParam = searchParams.get("d");

  let size = sizeParam === null ? 8 : parseInt(sizeParam);
  let count = countParam === null ? 3 : parseInt(countParam);
  let difficulty = difficultyParam === null ? -1 : parseInt(difficultyParam);
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
  let availablePieces = {} as Record<string, number>;
  if (pieces !== null) {
    let target = null;
    for (const letter of pieces) {
      if (isNaN(Number(letter))) {
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
          const nb = parseInt(letter);
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

  const maxPieceCount = Object.values(availablePieces).reduce(
    (a, b) => a + b,
    0
  );
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
    gamemode: gamemode as SetupData["gamemode"],
    difficulty,
  };
}
