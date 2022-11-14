import { Client } from 'boardgame.io/client';
import { Game } from './Game';
import rook from '../img/wR.png';
import knight from '../img/wN.png';
import bishop from '../img/wB.png';
import queen from '../img/wQ.png';
import king from '../img/wK.png';
import pawn from '../img/wP.png';
import blackPawn from '../img/bP.png';

class App {
    constructor(rootElement) {
        // Boardgame.io stuffs
        this.client = Client({ game: Game });
        this.client.start();
        this.rootElement = rootElement;

        // Current action selected under the board
        this.currAction = null;

        // Is the game over yet?
        this.didLost = false;

        // Method used for the timer
        this.timer = null;
        this.currTime = 0;
        this.timerDiv = document.getElementById("timer");

        // List of pieces we can spawn
        function findGetParameter(parameterName) { // https://stackoverflow.com/a/5448595
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
        let pieces = findGetParameter("p");
        this.size = findGetParameter("s");
        this.count = findGetParameter("c");
        this.gamemode = findGetParameter("g");

        this.size = this.size === null ? 8 : parseInt(this.size);
        this.count = this.count === null ? 3 : parseInt(this.count);
        if (this.gamemode !== 'p' && this.gamemode !== 'c') {
            this.gamemode = 'c';
        }

        if (this.size < 3 || this.size > 100) { // Invalid board size
            this.size = 8;
        }
        if (this.count < 1 || this.count >= this.size * this.size) { // Board size can't fit all pieces
            this.count = 3;
        }

        const validLetters = ['R', 'B', 'Q', 'N', 'P', 'K', 'A', 'D'];
        this.availablePieces = "";
        if (pieces !== null) {
            for (let letter of pieces) {
                if (validLetters.includes(letter.toUpperCase())) {
                    this.availablePieces += letter.toUpperCase();
                }
            }
        }
        if (this.availablePieces === "") { // No piece found, fallback on default value
            this.availablePieces = "RBNQ";
        }

        // Since pawns can't spawn on the top line, we need to be careful for boards only containing them
        const isOnlyPawn = this.availablePieces === 'P' || this.availablePieces === 'D' || (this.availablePieces.length === 2 && this.availablePieces.includes('P') && this.availablePieces.includes('D'))
        if (isOnlyPawn && this.count >= this.size * (this.size - 1)) {
            this.count = 3;
        }

        if (this.availablePieces === 'K' && this.count > 1) { // We can't have more than one king
            this.count = 1;
        }
        
        this.createBoard();
        this.attachListeners();

        this.client.subscribe(state =>
        {
            this.state = state;
            this.update(state);
        });

        // When we click "Restart" on the end of the game popup
        document.getElementById("popup-reload").addEventListener("click", _ => {
            this.timerDiv.innerHTML = "0:00";
            app = new App(document.getElementById('app'));
            document.getElementById("popup").hidden = true;
        });

        // Display/hide action button and select the first one
        let selected = false;
        for (let action of document.getElementsByClassName("action")) {
            // If we are on the shovel action we hide it if we are on puzzle mode
            // Else we hide it if the piece is not in the list of the one available
            const hidden = action.dataset.id === "" ? this.gamemode === 'p' : !this.availablePieces.includes(action.dataset.id);
            action.parentNode.hidden = hidden;
            if (!hidden && !selected) {
                action.classList.add("selected");
                this.currAction = action.dataset.id === "" ? null : action.dataset.id;
                selected = true;
            }
        }

        // For each action we assign the callback
        for (const elem of document.getElementsByClassName("action")) {
            // No point setting the callback of a button we won't be able to click
            if (elem.parentNode.hidden) {
                continue;
            }

            const curr = elem;
            elem.addEventListener("click", e => {
                for (const s of document.getElementsByClassName("selected")) {
                    s.classList.remove("selected");
                }
                curr.classList.add("selected");
                this.currAction = curr.dataset.id === "" ? null : curr.dataset.id;
            })
        }

        if (this.gamemode === 'p') {
            this.client.moves.generatePuzzleBoard(this.availablePieces, this.size, this.count);
            const cells = this.rootElement.querySelectorAll('.cell');
            cells.forEach(cell => {
                const id = parseInt(cell.dataset.id);

                if (this.state.G.knownCells[id]) {
                    const isWhite = this.isPosWhite(id)
                    cell.classList.add("open");
                    cell.classList.add(isWhite ? "white" : "black");
                }
            });
        }

        console.log(`Game loaded: ${this.gamemode === 'c' ? "classic" : "puzzle"} gamemode, ${this.count} piece${this.count > 1 ? "s" : ""}, ${this.size}x${this.size} grid, piece${this.availablePieces.length > 1 ? "s" : ""} allowed: ${this.availablePieces}`)
    }

    createBoard() {
        const rows = [];
        for (let i = 0; i < this.size; i++) {
            const cells = [];
            for (let j = 0; j < this.size; j++) {
                const id = this.size * i + j;
                cells.push(`<td class="cell" data-id="${id}"></td>`);
            }
            rows.push(`<tr>${cells.join('')}</tr>`);
        }

        this.rootElement.innerHTML = `
            <table>${rows.join('')}</table>
        `;
    }

    isPosWhite(id) {
        const y = Math.floor(id / this.size);
        const x = id % this.size;
        return (y % 2 == 0 && x % 2 == 0) || (y % 2 == 1 && x % 2 == 1)
    }

    attachListeners() {
        const cells = this.rootElement.querySelectorAll('.cell');
        cells.forEach(cell => {
            cell.onclick = (_) =>
            {
                if (this.didLost) {
                    return;
                }

                if (this.timer === null) {
                    this.timer = setInterval(() => {
                        this.currTime++;
                        const secs = this.currTime % 100;
                        this.timerDiv.innerHTML = `${Math.floor(this.currTime / 100)}:${secs < 10 ? ("0" + secs) : secs}`;
                    }, 10);
                }

                const id = parseInt(cell.dataset.id);

                if (this.state.G.cells === null) {
                    this.client.moves.generateBoard(id, this.availablePieces, this.size, this.count);
                }

                if (this.currAction !== null) {
                    if (this.state.G.knownCells[id] !== true) {
                        if (this.state.G.knownCells[id] === this.currAction) {
                            this.client.moves.removeHint(id);
                        } else {
                            this.client.moves.placeHint(id, this.currAction);
                        }

                        // TODO: rewrite this using proper victory condition thing
                        if (this.state.G.cells === null || Number.isInteger(this.state.G.cells[id]) || this.state.G.cells[id] != this.state.G.knownCells[id]) {
                            return;
                        }

                        for (let i = 0; i < 64; i++) {
                            if (!Number.isInteger(this.state.G.cells[i])) {
                                if (this.state.G.cells[i] !== this.state.G.knownCells[i] && this.state.G.cells[i] !== id) {
                                    return;
                                }
                            }
                            else if (this.state.G.knownCells[i] !== true && this.state.G.knownCells[i] !== false) {
                                return;
                            }
                        }
                        clearInterval(this.timer);
                        this.didLost = true;
                        document.getElementById("popup").hidden = false;
                        document.getElementById("popup-content").innerHTML = "You won";
                    }
                } else if (this.state.G.knownCells[id] === false) {
                    if (Number.isInteger(this.state.G.cells[id])) {
                        this.client.moves.discoverPiece(id);
                        cell.classList.add("open");

                        // Board color
                        const isWhite = this.isPosWhite(id)
                        cell.classList.add(isWhite ? "white" : "black");

                        // Text color
                        const colors = [
                            "#0001FD", // 1
                            "#017E00", // 2
                            "#FE0000", // 3
                            "#010082", // 4
                            "#830003", // 5
                            "#008080", // 6
                            "#000000", // 7
                            "#808080", // 8
                        ];
                        let color = "";
                        if (this.state.G.cells[id] === 0) color = "";
                        else if (this.state.G.cells[id] > 8) color = colors[7];
                        else color = colors[this.state.G.cells[id] - 1];
                        cell.style = "color: " + color + ";";
                    } else {
                        clearInterval(this.timer);
                        this.didLost = true;
                        document.getElementById("popup").hidden = false;
                        document.getElementById("popup-content").innerHTML = "You lost";
                        cell.classList.add("red");
                        this.update(this.state);
                    }
                }
            };
        });
    }

    update(state) {
        function getPiece(c) {
            let image = "";
            if (c === 'R') image = rook;
            else if (c === 'B') image = bishop;
            else if (c === 'Q') image = queen;
            else if (c === 'N') image = knight;
            else if (c === 'K') image = king;
            else if (c === 'P') image = pawn;
            else if (c === 'D') image = blackPawn;
            return `<img src="${image}"/>`;
        }

        const cells = this.rootElement.querySelectorAll('.cell');
        cells.forEach(cell => {
            const cellId = parseInt(cell.dataset.id);

            if (state.G.cells === null) {
                cell.innerHTML = "";
            } else if (this.didLost === true && !Number.isInteger(state.G.cells[cellId])) { // Display pieces of gameover
                cell.innerHTML = getPiece(state.G.cells[cellId]);
                cell.classList.add("red");
            } else if (state.G.knownCells[cellId] === true && state.G.cells[cellId] !== 0) {
                const cellValue = state.G.cells[cellId];
                cell.innerHTML = cellValue;
            } else if (state.G.knownCells[cellId] !== false && state.G.knownCells[cellId] !== true) {
                cell.innerHTML = getPiece(state.G.knownCells[cellId]);
            } else {
                cell.innerHTML = "";
            }
        });
    }
}

let app = new App(document.getElementById('app'));