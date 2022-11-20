function isValid(data, size, x, y) {
    return x >= 0 && x < size && y >= 0 && y < size && Number.isInteger(data[y * size + x]);
}

function parseMove(dx, dy, length, constraints, data, size, x, y) {
    let moves = [];
    let orientation = [];
    const directions = [
        [-dx, -dy], // Forward
        [dx, dy], // Backward
        [-dy, dx], // Right
        [dy, -dx] // Left
    ];
    for (let d of [-1, 1]) { // For pieces like knights, we need to reverse the X for each direction
        for (let rd in directions) {
            if ((constraints & (2 ** rd)) === 0) {
                continue;
            }
            const nrd = [directions[rd][0], directions[rd][1] * d];
            if (orientation.every(x => x[0] !== nrd[0] || x[1] !== nrd[1])) orientation.push(nrd);
        }
    }
    for (let [yi, xi] of orientation) {
        for (let i = 1; i <= length; i++) {
            if (isValid(data, size, x + (i * xi), y + (i * yi))) moves.push((y + (i * yi)) * size + (x + (i * xi)));
            else break;
        }
    }
    return moves;
}

function parseDirection(letter) {
    switch (letter) {
        case "W": return [1, 0];
        case "F": return [1, 1];
        case "D": return [2, 0];
        case "N": return [2, 1];
        case "A": return [2, 2];
        case "H": return [3, 0];
        case "C": return [3, 1];
        case "Z": return [3, 2];
        case "G": return [3, 3];
    }
}

function parseNotation(notation, data, size, x, y) {
    let str = "";
    for (let i = 0; i < notation.length; i++) {
        const s = notation[i];
        if (s === 'm') { // For "move" only, we discard them
            i++;
        } else if (s === 'c') { // For "capture" only, the ones we want to keep for the game
        } else {
            str += s;
        }
    }
    notation = str;

    let d = []; // Direction we are going
    let dir = null; // Letter indicating that direction
    let length = 1; // Length we are doing
    let moves = [];
    let constraints = 15;
    for (let s of notation) {
        if (s === s.toLowerCase()) {
            if (dir !== null) {
                moves = moves.concat(parseMove(d[0], d[1], length, constraints, data, size, x, y));
                dir = null;
                length = 1;
                constraints = 15;
            }
            switch (s) {
                case "f": constraints = 1; break;
                case "b": constraints = 2; break;
                case "l": constraints = 8; break;
                case "r": constraints = 4; break;
                case "v": constraints = 3; break;
                case "s": constraints = 12; break;
            }
        }
        else if (dir === null) {
            d = parseDirection(s);
            dir = s;
        } else if (!isNaN(s)) {
            length = parseInt(s);
        } else if (s === dir) {
            moves = moves.concat(parseMove(d[0], d[1], Infinity, constraints, data, size, x, y));
            dir = null;
            length = 1;
            constraints = 15;
        } else {
            moves = moves.concat(parseMove(d[0], d[1], length, constraints, data, size, x, y));
            d = parseDirection(s);
            dir = s;
            length = 1;
            constraints = 15;
        }
    }
    if (dir !== null) {
        moves = moves.concat(parseMove(d[0], d[1], length, constraints, data, size, x, y));
    }
    return moves;
}

// https://en.wikipedia.org/wiki/Betza%27s_funny_notation
const pieceMovesCheck = {
    'R': "WW",
    'B': "FF",
    'Q': "WWFF",
    'N': "N",
    'K': "WF",
    'P': "fmWfcF",
    'D': "bmWbcF",
    'O': "WWN",
    '飛': "WW",
    '角': "FF",
    '桂': "ffN",
    '歩': "fW",
    '玉': "WF",
    '香': "fWW",
    '銀': "FfW",
    '金': "WfF"
}

export function fillPositions(data) {
    let size = Math.sqrt(data.length); // Boards are always squared

    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            const value = data[y * size + x];
            if (!Number.isInteger(value)) {
                let moves = parseNotation(pieceMovesCheck[value], data, size, x, y);
                for (let move of moves) {
                    data[move]++;
                }
            }
        }
    }
    
    return data;
}

export function generateBoard(id, pieces, size, count) {
    let piecesMdf = {};
    for (let key in pieces) {
        piecesMdf[key] = pieces[key];
    }

    let data = Array(size * size).fill(0);
    let i = count;
    while (i > 0) {
        const rand = Math.floor(Math.random() * (size * size));
        if (rand !== id && Number.isInteger(data[rand])) {
            const value = Math.floor(Math.random() * Object.keys(piecesMdf).length);
            let piece = Object.keys(piecesMdf)[value];

            if (piecesMdf[piece] === 0) { // We reached the amount of time we could spawn that piece
                continue;
            }

            if ((piece === 'P' || piece === '桂' || piece === '歩' || piece === '香') && rand < size) { // Pawns shouldn't be able to spawn on the top line
                continue;
            }
            if (piece === 'D' && rand >= (size * (size - 1))) { // Pawns shouldn't be able to spawn on the top line
                continue;
            }

            data[rand] = piece;
            piecesMdf[piece]--;
            i--;
        }
    }
    return data;
}

export function validateBoard(data, discovered, pieces, size) {
    let thinkData = Array(size * size).fill(0);

    // For each tile...
    for (let i = 0; i < data.length; i++) {
        if (discovered[i] || thinkData[i] !== 0) { // We only want the ones we don't know about and the one we didn't validate yet
            continue;
        }

        let str = "";
        for (let piece of Object.keys(pieces)) // Check all pieces
        {
            // List of all moves for the current piece
            let moves = parseNotation(pieceMovesCheck[piece], thinkData, size, i % size, Math.floor(i / size));

            // If the piece have a move that is impossible, it means it can't be this one
            let isValid = true;
            for (let move of moves) {
                if (discovered[move] && data[move] === 0) {
                    isValid = false;
                    break;
                }
            }
            if (isValid) {
                str += piece;
            }
        }
        if (str !== "") { // We added a piece, need to revalidate the whole board
            thinkData[i] = str;
            i = -1;
        }
    }

    // Check if we are sure that only one position is possible
    let isSolved = true;
    for (let i = 0; i < data.length; i++) {
        if (!discovered[i] &&
            ((Number.isInteger(data[i]) && thinkData[i] !== 0) ||
                (!Number.isInteger(data[i]) && thinkData[i] !== data[i]))) {
            isSolved = false;
            break;
        }
    }

    return {
        isSolved: isSolved,
        thinkData: thinkData
    };
}
