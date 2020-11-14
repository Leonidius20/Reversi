import { getPossibleMoves, WHITE, BLACK } from "./game";
import { applyMove, utilityFunction } from "./ai";

class Player {
    constructor(color) {
        this.color = color;
    }
}

export class HumanPlayer extends Player {

    makeMove(move) {
        this.resolvePromise(move);
    }

    nextMove(boardState) {
        if (getPossibleMoves(this, boardState).length === 0) {
            return Promise.resolve(null);
        }

        return new Promise(((resolve) => {
            this.resolvePromise = resolve;
        }));
    }

}

class AiPlayer extends Player {}

export class RandomAiPlayer extends AiPlayer {

    nextMove(boardState) {
        const moves = getPossibleMoves(this, boardState);
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(moves.length === 0
                    ? null
                    : moves[Math.floor(Math.random() * moves.length)]);
            }, 2000);
        });
    }

}

class HeuristicAiPlayer extends AiPlayer {

    constructor(heuristic, color, maxDepth) {
        super(color);
        this.heuristic = heuristic;
        this.maxDepth = maxDepth;
    }

    nextMove(boardState) {
        //todo replace node with { state, value, move }
        const result = this.minmax(0,
            {
                boardState: boardState,
                value: null,
                move: null,
            }, this.color);

        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(result.move);
            }, 2000);
        });
    }

    // returns the best node with value and move filled
    minmax(currentDepth, node, currentColor) {

        // todo: actually find min and max values
        // instead of whatever the hell is going on in here
        if (currentDepth === this.maxDepth || this.isTerminalState(node)) {
            node.value = this.heuristic(this.color, node.boardState);
            return node;
        }

        let bestValue = currentColor === WHITE ? -1 : Infinity;
        let bestNode = null;
        let bestMove = null;

        for (const move of getPossibleMoves({color: currentColor}, node.boardState)) {
            const newBoardState = applyMove(node.boardState, currentColor, move);

            const newEvaluatedNode = this.minmax(currentDepth + 1, {
                boardState: newBoardState,
                value: null,
                move, // this move is made by alternating players!
            }, !currentColor);

            if ((currentColor === WHITE && bestValue < newEvaluatedNode.value)
                || (currentColor === BLACK && bestValue > newEvaluatedNode.value)) {
                bestValue = newEvaluatedNode.value;
                bestNode = newEvaluatedNode;
                bestMove = move;
            }
        }

        if (bestNode === null) {
            bestNode = node;
            bestValue = this.heuristic(this.color, node.boardState);
        }

        bestNode.value = bestValue;
        bestNode.move = bestMove;
        return bestNode;
    }

    isTerminalState(node) {
        // if there are empty cells on the board
        let hasEmptyCells = false;
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (node.boardState[i][j] == null) {
                    hasEmptyCells = true;
                    break;
                }
            }
            if (hasEmptyCells) break;
        }

        if (!hasEmptyCells) return true;

        // two consecutive passes
        /*return getPossibleMoves({color: BLACK}, this.boardState).length === 0
            && getPossibleMoves({color: WHITE}, this.boardState).length === 0;*/

        // return getPossibleMoves({color: WHITE}, node.boardState).length === 0;
        return false;
    }

}

export class GreedyAiPlayer extends HeuristicAiPlayer {

    constructor(color) {
        super((color, boardState) => utilityFunction(color, boardState),
            color, 6);
    }

}