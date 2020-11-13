// thanks https://towardsdatascience.com/create-ai-for-your-own-board-game-from-scratch-minimax-part-2-517e1c1e3362
import {DIRECTIONS, FlipHandler, iterateCells} from "./board_iterators";

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

export function applyMove(boardState, color, move) {
    const newBoardState = boardState.slice();
    newBoardState[move.x][move.y] = color;

    // flipping pieces
    for (const direction of DIRECTIONS) {
        const handler = new FlipHandler(color);
        iterateCells(newBoardState, move, direction, handler);
        if (handler.flip) {
            for (const piece of handler.piecesToFlip) {
                newBoardState[piece.x][piece.y] = color;
            }
        }
    }

    return newBoardState;
}

export class TreeNode {

    /**
     * Node of game tree
     * @param boardState state of the board at this point (2D array)
     * @param value cost/fitness of this position
     */
    constructor(boardState, value) {
        this.boardState = boardState;
        this.value = value;
    }

    isTerminalState() {
        for (let i = 0; i < 8; i++) {
            // if there are empty cells on the board
            if (this.boardState[i].includes(null)) return true;
        }

        // TODO: no more moves by either party
        // possibleMoves(black) && possibleMoves(white) are empty

        return false;
    }

}