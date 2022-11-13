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
        const cells = this.rootElement.querySelectorAll('.cell');
        cells.forEach(cell => {
            cell.onclick = (_) =>
            {
                const id = cell.dataset.id;
                if (!this.state.G.knownCells[id]) {
                    if (Number.isInteger(this.state.G.cells[id])) {
                        this.client.moves.discoverPiece(id);
                        cell.classList.add("open");
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

            if (state.G.knownCells[cellId]) {
                const cellValue = state.G.cells[cellId];
                cell.innerHTML = cellValue;
            } else {
                cell.innerHTML = "";
            }
        });
    }
}

const app = new App(document.getElementById('app'));