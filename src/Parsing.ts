import { SetupData } from "./Game";
import { piecesImages } from "./Pieces";

export function parseUrl(
  searchParams: URLSearchParams
): Omit<SetupData, "seed"> & { seed: string | null } {
  const seed = searchParams.get("r");
  const pieces = searchParams.get("p");
  const sizeParam = searchParams.get("s");
  const countParam = searchParams.get("c");
  let gamemode = searchParams.get("g");
  const difficultyParam = searchParams.get("d");

  let size = sizeParam === null ? 8 : parseInt(sizeParam);
  let count = countParam === null ? 3 : parseInt(countParam);
  if (gamemode === null) {
    gamemode = "p";
  }

  if (gamemode !== "p" && gamemode !== "c" && gamemode !== "r") {
    console.warn(
      `Parsing error: invalid gamemode ${gamemode}, falling back on puzzle`
    );
    gamemode = "p";
  }

  if (size < 3 || size > 1000) {
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

  let difficulty = gamemode === "p" ? 30 : -1;

  if (difficultyParam !== null) {
    difficulty = parseInt(difficultyParam);

    if (gamemode !== "p" && difficulty !== -1) {
      console.warn("Difficulty argument is ignored outside of puzzle gamemode");
    } else if (
      gamemode === "p" &&
      (difficulty < 1 || difficulty >= size * size - count)
    ) {
      console.warn(
        `Parsing error: invalid difficulty ${difficulty}, unsetting difficulty`
      );

      difficulty = -1;
    }
  }

  const validLetters = Object.keys(piecesImages);
  let availablePieces = {} as Record<string, number>;
  if (pieces !== null) {
    let target = null;

    // Pieces string containing each piece, optionally followed by a number indicating the max value it can have
    for (let i = 0; i < pieces.length; i++) {
      let letter = pieces[i];
      if (isNaN(Number(letter))) {
        // Piece found
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
        // Number indicator found
        if (target === null) {
          console.warn(`Parsing error: no piece specified, value ignored`);
        } else {
          while (i + 1 < pieces.length && !isNaN(Number(pieces[i + 1]))) {
            // The next value in the string is also a number!
            i++;
            letter += pieces[i];
          }

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
