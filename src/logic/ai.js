// thanks https://towardsdatascience.com/create-ai-for-your-own-board-game-from-scratch-minimax-part-2-517e1c1e3362
import {DIRECTIONS, FlipHandler, iterateCells} from "./board_iterators";
import {BLACK, WHITE, getPossibleMoves} from "./game";

// is applied to terminal positions to determine their value
export function utilityFunction(color, boardState) {
    let counter = 0;
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (boardState[i][j] === color) counter++;
        }
    }
    return counter;
}

function clone2dArray(array) {
    const result = Array(array.length);
    for (let i = 0; i < array.length; i++) {
        result[i] = array[i].slice();
    }
    return result;
}

export function applyMove(boardState, color, move) {
    const newBoardState = clone2dArray(boardState);
    newBoardState[move.x][move.y] = color;

    // flipping pieces
    for (const direction of DIRECTIONS) {
        const handler = new FlipHandler(color);
        iterateCells(boardState, move, direction, handler);
        if (handler.flip) {
            for (const piece of handler.piecesToFlip) {
                newBoardState[piece.x][piece.y] = color;
            }
        }
    }

    return newBoardState;
}