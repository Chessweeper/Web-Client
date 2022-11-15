import { Client } from 'boardgame.io/client';
import { Game } from './Game';
import rook from '../img/wR.png';
import knight from '../img/wN.png';
import bishop from '../img/wB.png';
import queen from '../img/wQ.png';
import king from '../img/wK.png';
import pawn from '../img/wP.png';
import blackPawn from '../img/bP.png';
import knook from '../img/knook.png';
import shogiRook from '../img/shogiRook.svg';
import shogiBishop from '../img/shogiBishop.svg';
import shogiKnight from '../img/shogiKnight.svg';
import shogiPawn from '../img/shogiPawn.svg';
import shogiKing from '../img/shogiKing.svg';
import shogiLance from '../img/shogiLance.svg';
import shogiSilverGeneral from '../img/shogiSilverGeneral.svg';
import shogiGoldGeneral from '../img/shogiGoldGeneral.svg';

class App {
    constructor(rootElement) {
        // Boardgame.io stuffs
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

        // Setting everything from URL parameter
        let pieces = findGetParameter("p");
        this.size = findGetParameter("s");
        this.count = findGetParameter("c");
        this.gamemode = findGetParameter("g");
        const seed = findGetParameter("r") ?? undefined;

        this.size = this.size === null ? 8 : parseInt(this.size);
        this.count = this.count === null ? 3 : parseInt(this.count);
        if (this.gamemode === null) {
            this.gamemode = 'c';
        }

        if (this.gamemode !== 'p' && this.gamemode !== 'c') {
            console.warn(`Parsing error: invalid gamemode ${this.gamemode}, falling back on classic`);
            this.gamemode = 'c';
        }

        if (this.size < 3 || this.size > 100) { // Invalid board size
            console.warn(`Parsing error: invalid board size ${this.size}, falling back on 8`);
            this.size = 8;
        }
        if (this.count < 1 || this.count >= this.size * this.size) { // Board size can't fit all pieces
            console.warn(`Parsing error: invalid piece count ${this.count}, falling back on 3`);
            this.count = 3;
        }

        this.piecesImages = {
            'R': rook,
            'B': bishop,
            'Q': queen,
            'N': knight,
            'P': pawn,
            'K': king,
            'D': blackPawn,
            'O': knook,
            '飛': shogiRook,
            '角': shogiBishop,
            '桂': shogiKnight,
            '歩': shogiPawn,
            '玉': shogiKing,
            '香': shogiLance,
            '銀': shogiSilverGeneral,
            '金': shogiGoldGeneral
        }
        const validLetters = Object.keys(this.piecesImages);
        this.availablePieces = {};
        if (pieces !== null) {
            let target = null;
            for (let letter of pieces) {
                if (isNaN(letter)) {
                    if (target !== null) {
                        this.availablePieces[letter.toUpperCase()] = Infinity;
                    }

                    if (validLetters.includes(letter.toUpperCase())) {
                        target = letter.toUpperCase();
                    } else {
                        console.warn(`Parsing error: unknown piece ${letter.toUpperCase()}, value ignored`);
                    }
                } else {
                    if (target === null) {
                        console.warn(`Parsing error: no piece specified, value ignored`);
                    } else {
                        let nb = parseInt(letter);
                        if (nb > 0) {
                            this.availablePieces[target] = nb;
                            target = null;
                        } else {
                            console.warn("Parsing error: piece count must be superior to 0, value ignored");
                        }
                    }
                }
            }
            if (target !== null) {
                this.availablePieces[target.toUpperCase()] = Infinity;
            }
        }
        if (Object.keys(this.availablePieces).length === 0) { // No piece found, fallback on default value
            this.availablePieces = {
                'R': Infinity,
                'B': Infinity,
                'N': Infinity,
                'Q': Infinity
            };
        }

        let maxPieceCount = Object.values(this.availablePieces).reduce((a, b) => a + b, 0);
        if (this.count > maxPieceCount) {
            console.warn(`Parsing error: piece limits of total ${maxPieceCount} is lower than given piece count of ${this.count}, piece count set to ${(maxPieceCount)}`);
            this.count = maxPieceCount;
        }

        // Since pawns can't spawn on the top line, we need to be careful for boards only containing them
        const isOnlyPawn = Object.keys(this.availablePieces).some(x => x !== 'P' && x !== 'D' && x !== '桂' && x !== '歩' && x !== '香')
        if (isOnlyPawn && this.count >= this.size * (this.size - 1)) {
            console.warn(`Parsing error: board size of ${this.size} doesn't give enough space given the piece count of ${this.count} of the given type, falling back piece count on 3`);
            this.count = 3;
        }

        // Init boardgame.io stuffs
        this.createBoard();
        this.attachListeners();

        this.client = Client({ game: { ...Game, seed }});
        this.client.start();
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

        // Remove selected buttons from a previous game
        for (const s of document.getElementsByClassName("selected")) {
            s.classList.remove("selected");
        }

        // Display/hide action button and select the first one
        let actionButtons = [];

        let selected = false;
        for (let action of document.getElementsByClassName("action")) {
            // If we are on the shovel action we hide it if we are on puzzle mode
            // Else we hide it if the piece is not in the list of the one available
            const hidden = action.dataset.id === "" ? this.gamemode === 'p' : !Object.keys(this.availablePieces).includes(action.dataset.id);
            action.parentNode.hidden = hidden;
            if (!hidden) {
                if (!selected) {
                    action.classList.add("selected");
                    this.currAction = action.dataset.id === "" ? null : action.dataset.id;
                    selected = true;
                }
                actionButtons.push(action);
            }
        }

        let me = this;
        window.onkeydown = function(e) {
            if (e.keyCode >= 49 && e.keyCode <= 57) {
                e.preventDefault();
                const index = e.keyCode - 49;
                if (index < actionButtons.length) {
                    for (const s of document.getElementsByClassName("selected")) {
                        s.classList.remove("selected");
                    }
                    actionButtons[index].classList.add("selected");
                    me.currAction = actionButtons[index].dataset.id === "" ? null : actionButtons[index].dataset.id;
                }
            }
        }

        // For each action we assign the callback
        for (const elem of document.getElementsByClassName("action")) {
            // No point setting the callback of a button we won't be able to click
            if (elem.parentNode.hidden) {
                continue;
            }

            const curr = elem;
            elem.addEventListener("click", _ => {
                for (const s of document.getElementsByClassName("selected")) {
                    s.classList.remove("selected");
                }
                curr.classList.add("selected");
                this.currAction = curr.dataset.id === "" ? null : curr.dataset.id;
            })
        }

        if (this.gamemode === 'p') {
            this.client.moves.generatePuzzleBoard(this.availablePieces, this.size, this.count);
            if (this.state.G.knownCells == null) { // Failed to generate a board
                this.didLost = true;
            } else {
                const cells = this.rootElement.querySelectorAll('.cell');
                cells.forEach(cell => {
                    const id = parseInt(cell.dataset.id);

                    if (this.state.G.knownCells[id]) {
                        const isWhite = this.isPosWhite(id)
                        cell.classList.add("open");
                        cell.classList.add(isWhite ? "white" : "black");
                        cell.style = this.getPosColor(this.state.G.cells[id]);
                    }
                });
            }
        } else {
            this.createBoard();
        }

        console.log(`Game loaded: ${this.gamemode === 'c' ? "classic" : "puzzle"} gamemode${seed != null ? ` with a seed of \"${seed}\"` : ""}, ${this.count} piece${this.count > 1 ? "s" : ""}, ${this.size}x${this.size} grid, piece${Object.keys(this.availablePieces).length > 1 ? "s" : ""} allowed: ${Object.keys(this.availablePieces).map(x => `${x} (x${this.availablePieces[x]})`).join(', ')}`)
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

    getPosColor(tileValue) {
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
        if (tileValue === 0) color = "";
        else if (tileValue > 8) color = colors[7];
        else color = colors[tileValue - 1];
        return `color: ${color};`;
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
                        cell.style = this.getPosColor(this.state.G.cells[id]);
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

    getPiece(c) {
        let image = this.piecesImages[c];
        return `<img src="${image}"/>`;
    }

    update(state) {
        const cells = this.rootElement.querySelectorAll('.cell');
        cells.forEach(cell => {
            const cellId = parseInt(cell.dataset.id);

            if (state.G.cells === null) {
                cell.innerHTML = "";
            } else if (this.didLost === true && !Number.isInteger(state.G.cells[cellId])) { // Display pieces of gameover
                cell.innerHTML = this.getPiece(state.G.cells[cellId]);
                cell.classList.add("red");
            } else if (state.G.knownCells[cellId] === true && state.G.cells[cellId] !== 0) {
                const cellValue = state.G.cells[cellId];
                cell.innerHTML = cellValue;
            } else if (state.G.knownCells[cellId] !== false && state.G.knownCells[cellId] !== true) {
                cell.innerHTML = this.getPiece(state.G.knownCells[cellId]);
            } else {
                cell.innerHTML = "";
            }
        });
    }
}

let app = new App(document.getElementById('app'));