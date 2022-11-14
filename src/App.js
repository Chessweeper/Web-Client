import { Client } from 'boardgame.io/client';
import { Game } from './Game';
import rook from '../img/wR.png';
import knight from '../img/wN.png';
import bishop from '../img/wB.png';
import queen from '../img/wQ.png';
import king from '../img/wK.png';
import pawn from '../img/wP.png';

class App {
    constructor(rootElement) {
        // Boardgame.io stuffs
        this.client = Client({ game: Game });
        this.client.start();
        this.rootElement = rootElement;

        this.createBoard();
        this.attachListeners();

        this.client.subscribe(state =>
        {
            this.state = state;
            this.update(state);
        });

        // Current action selected under the board
        this.currAction = null;

        // Is the game over yet?
        this.didLost = false;

        // Method used for the timer
        this.timer = null;
        this.currTime = 0;
        this.timerDiv = document.getElementById("timer");

        // For each action we assign the callback
        for (const elem of document.getElementsByClassName("action")) {
            const curr = elem;
            elem.addEventListener("click", e => {
                for (const s of document.getElementsByClassName("selected")) {
                    s.classList.remove("selected");
                }
                curr.classList.add("selected");
                this.currAction = curr.dataset.id === "" ? null : curr.dataset.id;
            })
        }

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
        const validLetters = ['R', 'B', 'Q', 'N', 'P', 'K'];
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

        for (let action of document.getElementsByClassName("action")) {
            action.parentNode.hidden = !this.availablePieces.includes(action.dataset.id);
        }
    }

    createBoard() {
        const size = 8;
        const rows = [];
        for (let i = 0; i < size; i++) {
            const cells = [];
            for (let j = 0; j < size; j++) {
                const id = size * i + j;
                cells.push(`<td class="cell" data-id="${id}"></td>`);
            }
            rows.push(`<tr>${cells.join('')}</tr>`);
        }

        this.rootElement.innerHTML = `
            <table>${rows.join('')}</table>
        `;
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
                        this.timerDiv.innerHTML = `${Math.floor(this.currTime / 100)}:${this.currTime % 100}`;
                    }, 10);
                }

                const id = cell.dataset.id;
                if (this.currAction !== null) {
                    if (this.state.G.knownCells[id] !== true) {
                        if (this.state.G.knownCells[id] === this.currAction) {
                            this.client.moves.removeHint(id);
                        } else {
                            this.client.moves.placeHint(id, this.currAction);
                        }

                        // TODO: rewrite this using proper victory condition thing
                        if ( this.state.G.cells === null || Number.isInteger(this.state.G.cells[id]) || this.state.G.cells[id] != this.state.G.knownCells[id]) {
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
                        document.getElementById("popup").innerHTML = "You won";
                    }
                } else if (this.state.G.knownCells[id] === false) {
                    if (this.state.G.cells === null || Number.isInteger(this.state.G.cells[id])) {
                        this.client.moves.discoverPiece(id, this.availablePieces);
                        cell.classList.add("open");

                        // Board color
                        const y = Math.floor(id / 8);
                        const x = id % 8;
                        const isWhite = (y % 2 == 0 && x % 2 == 0) || (y % 2 == 1 && x % 2 == 1)
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
                        document.getElementById("popup").innerHTML = "You lost";
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
            return `<img src="${image}"/>`;
        }

        const cells = this.rootElement.querySelectorAll('.cell');
        cells.forEach(cell => {
            const cellId = parseInt(cell.dataset.id);

            if (this.didLost === true && !Number.isInteger(state.G.cells[cellId])) { // Display pieces of gameover
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

const app = new App(document.getElementById('app'));