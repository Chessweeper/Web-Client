import { Client } from 'boardgame.io/client';
import { Game } from './Game';

class App {
    constructor(rootElement) {
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

        this.selected = null;
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

    cleanTiles() {
        const cells = this.rootElement.querySelectorAll('.cell');
        this.selected = null;
    }

    attachListeners() {
        function tryDiscover(client, G, root, y, x, tmpBuffer) {
            const v = y * 8 + x;
            if (y >= 0 && y < 8 && x >= 0 && x < 8 && !G.knownCells[v] && G.cells[v] === 0 && !tmpBuffer.includes(v)) {
                const cells = root.querySelectorAll('[data-id~="' + v + '"]');
                cells[0].classList.add("open");
                client.moves.discoverPiece(v);
                tmpBuffer.push(v);
                tryDiscover(client, G, root, y - 1, x, tmpBuffer);
                tryDiscover(client, G, root, y + 1, x, tmpBuffer);
                tryDiscover(client, G, root, y, x - 1, tmpBuffer);
                tryDiscover(client, G, root, y, x + 1, tmpBuffer);
            }
        }

        const cells = this.rootElement.querySelectorAll('.cell');
        cells.forEach(cell => {
            cell.onclick = (_) =>
            {
                const id = cell.dataset.id;
                if (!this.state.G.knownCells[id]) {
                    if (Number.isInteger(this.state.G.cells[id])) {
                        /* To discover many pieces at once, doesn't really work well game design wise
                        if (this.state.G.cells[id] === 0) {
                            tryDiscover(this.client, this.state.G, this.rootElement, Math.floor(id / 8), id % 8, []);
                        } else */
                        {
                            this.client.moves.discoverPiece(id);
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
                        }
                    } else {
                        console.log("You lost");
                        cell.classList.add("red");
                    }
                }
            };
        });
    }

    update(state) {
        const cells = this.rootElement.querySelectorAll('.cell');
        cells.forEach(cell => {
            const cellId = parseInt(cell.dataset.id);

            if (state.G.knownCells[cellId] && state.G.cells[cellId] !== 0) {
                const cellValue = state.G.cells[cellId];
                cell.innerHTML = cellValue;
            } else {
                cell.innerHTML = "";
            }
        });
    }
}

const app = new App(document.getElementById('app'));