const oldAppTodo = () => {
  for (const s of document.getElementsByclassNameName("selected")) {
    s.classNameList.remove("selected");
  }

  // Display/hide action button and select the first one
  let actionButtons = [];
}


export const Board = () => {
//   // Method used for the timer
//   this.timer = null;
//   this.currTime = 0;
//   this.timerDiv = document.getElementById("timer");

//   // Init boardgame.io stuffs
//   this.createBoard(setupData.size);
//   this.attachListeners();

//   // Generate board for puzzle gamemode
//   if (setupData.gamemode === 'p') {
//       if (this.state.G.knownCells === null) { // Failed to generate a board
//           this.client.events.endGame({ error: "Failed to generate a board" });
//       } else {
//           const cells = this.rootElement.querySelectorAll('.cell');
//           cells.forEach(cell => {
//               const id = parseInt(cell.dataset.id);

//               if (this.state.G.knownCells[id]) {
//                   const isWhite = this.isPosWhite(id)
//                   cell.classNameList.add("open");
//                   cell.classNameList.add(isWhite ? "white" : "black");
//                   cell.style = this.getPosColor(this.state.G.cells[id]);
//               }
//           });
//       }
//   }

//   console.log(`Game loaded: ${setupData.gamemode === 'c' ? "classNameic" : "puzzle"} gamemode${seed != null ? ` with a seed of \"${seed}\"` : ""}, ${setupData.count} piece${setupData.count > 1 ? "s" : ""}, ${setupData.size}x${setupData.size} grid, piece${Object.keys(setupData.pieces).length > 1 ? "s" : ""} allowed: ${Object.keys(setupData.pieces).map(x => `${x} (x${setupData.pieces[x]})`).join(', ')}`)
// }

// createBoard(size) {
//   const rows = [];
//   for (let i = 0; i < size; i++) {
//       const cells = [];
//       for (let j = 0; j < size; j++) {
//           const id = size * i + j;
//           cells.push(`<td className="cell" data-id="${id}"></td>`);
//       }
//       rows.push(`<tr>${cells.join('')}</tr>`);
//   }

//   this.rootElement.innerHTML = `
//       <table>${rows.join('')}</table>
//   `;
// }

// isPosWhite(id) {
//   const { size } = this.state.G;
//   const y = Math.floor(id / size);
//   const x = id % size;
//   return (y % 2 == 0 && x % 2 == 0) || (y % 2 == 1 && x % 2 == 1)
// }

// getPosColor(tileValue) {
//   // Text color
//   const colors = [
//       "#0001FD", // 1
//       "#017E00", // 2
//       "#FE0000", // 3
//       "#010082", // 4
//       "#830003", // 5
//       "#008080", // 6
//       "#000000", // 7
//       "#808080", // 8
//   ];
//   let color = "";
//   if (tileValue === 0) color = "";
//   else if (tileValue > 8) color = colors[7];
//   else color = colors[tileValue - 1];
//   return `color: ${color};`;
// }

// reload() {
//   this.unsubscribe();
//   this.detachListeners();
//   this.timerDiv.innerHTML = "0:00";
//   app = new App(document.getElementById('app'));
//   document.getElementById("popup").hidden = true;
// }

// onActionChange(e) {
//   for (const s of document.getElementsByclassNameName("selected")) {
//       s.classNameList.remove("selected");
//   }
//   e.currentTarget.classNameList.add("selected");
//   this.currAction = e.currentTarget.dataset.id === "" ? null : e.currentTarget.dataset.id;
// }

// detachListeners() {
//   document.getElementById("popup-reload").removeEventListener("click", this.reload);

//   for (const elem of document.getElementsByclassNameName("action")) {
//       if (elem.parentNode.hidden) {
//           continue;
//       }
//       elem.removeEventListener("click", this.onActionChange);
//   }
// }

// attachListeners() {
//   // When we click "Restart" on the end of the game popup
//   document.getElementById("popup-reload").addEventListener("click", this.reload);

//   // For each action we assign the callback
//   for (const elem of document.getElementsByclassNameName("action")) {
//       // No point setting the callback of a button we won't be able to click
//       if (elem.parentNode.hidden) {
//           continue;
//       }
//       elem.addEventListener("click", this.onActionChange);
//   }

//   const cells = this.rootElement.querySelectorAll('.cell');
//   cells.forEach(cell => {
//       cell.onclick = (_) =>
//       {
//           if (this.state.ctx.gameover) {
//               return;
//           }

//           if (this.timer === null) {
//               this.timer = setInterval(() => {
//                   this.currTime++;
//                   const secs = this.currTime % 100;
//                   this.timerDiv.innerHTML = `${Math.floor(this.currTime / 100)}:${secs < 10 ? ("0" + secs) : secs}`;
//               }, 10);
//           }

//           const id = parseInt(cell.dataset.id);

//           if (this.state.G.cells === null) {
//               this.client.moves.generateBoard(id);
//           }

//           if (this.currAction !== null) {
//               if (this.state.G.knownCells[id] === this.currAction) {
//                   this.client.moves.removeHint(id);
//               } else {
//                   this.client.moves.placeHint(id, this.currAction);
//               }
//           } else {
//               this.client.moves.discoverPiece(id);

//               if (Number.isInteger(this.state.G.cells[id])) {
//                   cell.classNameList.add("open");

//                   // Board color
//                   const isWhite = this.isPosWhite(id)
//                   cell.classNameList.add(isWhite ? "white" : "black");

//                   // Text color
//                   cell.style = this.getPosColor(this.state.G.cells[id]);
//               }
//           }
//       };
//   });
// }

// update(state) {
//   const cells = this.rootElement.querySelectorAll('.cell');
//   cells.forEach(cell => {
//       const cellId = parseInt(cell.dataset.id);

//       if (state.G.cells === null) {
//           cell.innerHTML = "";
//       } else if (state.ctx.gameover?.isWin === false && !Number.isInteger(state.G.cells[cellId])) { // Display pieces of gameover
//           cell.innerHTML = getPiece(state.G.cells[cellId]);
//           cell.classNameList.add("red");
//       } else if (state.G.knownCells[cellId] === true && state.G.cells[cellId] !== 0) {
//           const cellValue = state.G.cells[cellId];
//           cell.innerHTML = cellValue;
//       } else if (state.G.knownCells[cellId] !== false && state.G.knownCells[cellId] !== true) {
//           cell.innerHTML = getPiece(state.G.knownCells[cellId]);
//       } else {
//           cell.innerHTML = "";
//       }
//   });

//   if (state.ctx.gameover && document.getElementById("popup").hidden) {
//       if (this.timer != null) clearInterval(this.timer);
//       document.getElementById("popup").hidden = false;
//       document.getElementById("popup-content").innerHTML = message;
//   }
  
  
  return (
    <div id="app">Generating board...</div>
  );
};
