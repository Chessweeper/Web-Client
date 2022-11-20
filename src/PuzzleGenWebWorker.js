import { fillPositions, generateBoard, validateBoard } from "./Algs";

function generatePuzzleBoard(pieces, size, count, difficulty) {
  let data;
  let discovered;
  let hasError = false;

  let c = 0;
  const maxIt = 300;
  for (; c < maxIt; c++)
  {
      data = fillPositions(generateBoard(-1, pieces, size, count));
      discovered = Array(size * size).fill(false);

      let thinkData = null;
      let isSolved = false;
      let giveup = false;
      while (!isSolved && !giveup) {
          // Get a random position that is not a piece and wasn't already taken
          let possibilities = [];
          for (let i in data) {
              if (!discovered[i] && Number.isInteger(data[i]) && (thinkData === null || thinkData[i] !== 0)) {
                  possibilities.push(i);
              }
          }
          if (possibilities.length > 0) {
              let randPos = Math.floor(Math.random() * possibilities.length);
              discovered[possibilities[randPos]] = true;
          } else {
              giveup = true; // Algorithm failed with this generation, we give up
              continue;
          }

          let validation = validateBoard(data, discovered, pieces, size);
          isSolved = validation["isSolved"];
          thinkData = validation["thinkData"];
      }

      if (!isSolved) {
          console.log("Skipping unsolvabled puzzle");
      } else {
          for (let i = 0; i < data.length; i++) {
              if (!discovered[i]) {
                  continue;
              }

              discovered[i] = false;
              let validation = validateBoard(data, discovered, pieces, size);
              if (!validation["isSolved"]) {
                  discovered[i] = true;
              }
          }

          let emptyCasesAfter = discovered.filter(x => x === false).length;

          if (difficulty !== -1 && difficulty > emptyCasesAfter) {
              console.log(`Skipping puzzle with ${emptyCasesAfter} empty tiles`);
          } else {
              if (difficulty !== -1) {
                  // Set tiles to adjust difficulty

                  let possibleTarget = [];
                  for (let i = 0; i < data.length; i++) {
                      if (!discovered[i] && Number.isInteger(data[i])) {
                          possibleTarget.push(i);
                      }
                  }
                  for (let i = emptyCasesAfter; i > difficulty; i--) {
                      const rand = Math.floor(Math.random() * possibleTarget.length);
                      discovered[possibleTarget[rand]] = true;
                      possibleTarget.splice(rand, 1).indexOf(rand);
                  }
              }
              console.log(`Generated solved puzzle with ${discovered.filter(x => x === false).length} empty tiles`);
              break;
          }
      }
  }

  if (c === maxIt) {
      hasError = true;
  }

  let cells = data;
  let knownCells = Array(size * size).fill(false);

  for (let i in discovered) {
      if (discovered[i]) {
          knownCells[i] = true;
      }
  }
  postMessage({ cells, knownCells, hasError });

  // return { data, discovered, hasError };
}

// web worker stuff
onmessage = (event) => {
  const { pieces, size, count, difficulty, gamemode } = event.data;
  if (gamemode === 'p') {
    generatePuzzleBoard(pieces, size, count, difficulty);
  } else {
    postMessage({ cells: null, knownCells: null });
  }
}