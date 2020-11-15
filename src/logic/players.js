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

    triggerMove(game) {
        if (getPossibleMoves(this, game.state.boardState).length === 0) {
            game.makeHumanMove(null);
        }
    }

}

class AiPlayer extends Player {}

export class RandomAiPlayer extends AiPlayer {

    triggerMove(game) {
        setTimeout(() => {
            const moves = getPossibleMoves(this, game.state.boardState);
            game.computerMove(moves.length === 0
                ? null
                : moves[Math.floor(Math.random() * moves.length)]);
        }, 2000);
    }

}

class HeuristicAiPlayer extends AiPlayer {

    constructor(heuristic, color, maxDepth) {
        super(color);
        this.heuristic = heuristic;
        this.maxDepth = maxDepth;
    }

    triggerMove(game) {
        setTimeout(() => {
            const result = this.minmax(0,
                {
                    boardState: game.state.boardState,
                    value: null,
                    move: null,
                }, this.color, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY);
            game.computerMove(result.move);
        }, 2000);
    }

    // returns the best node with value and move filled
    // alpha - best value for minimizing player so far
    // beta - best value for maximizing player so far
    minmax(currentDepth, node, currentColor, alpha, beta) {
        if (currentDepth === this.maxDepth || this.isTerminalState(node)) {
            node.value = this.heuristic(this.color, node.boardState, node.move);
            return node;
        }

        let bestValue = currentColor === WHITE ? -1 : Infinity;
        let bestNode = null;
        let bestMove = null;

        for (const move of getPossibleMoves({color: currentColor}, node.boardState)) {
            const newBoardState = applyMove(node.boardState, currentColor, move, alpha, beta);

            const newEvaluatedNode = this.minmax(currentDepth + 1, {
                boardState: newBoardState,
                value: null,
                move, // this move is made by alternating players!
            }, !currentColor);

            if (currentColor === WHITE && bestValue < newEvaluatedNode.value) {
                bestValue = newEvaluatedNode.value;
                bestNode = newEvaluatedNode;
                bestMove = move;
                alpha = Math.max(alpha, bestValue);
                if (beta <= alpha) {
                    break;
                }
            } else if (currentColor === BLACK && bestValue > newEvaluatedNode.value) {
                bestValue = newEvaluatedNode.value;
                bestNode = newEvaluatedNode;
                bestMove = move;
                beta = Math.min(beta, bestValue);
                if (beta <= alpha) {
                    break;
                }
            }


        }

        if (bestNode === null) {
            bestNode = node;
            bestValue = this.heuristic(this.color, node.boardState, node.move);
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

        return !hasEmptyCells;
    }

}

export class GreedyAiPlayer extends HeuristicAiPlayer {

    constructor(color) {
        super((color, boardState, move) => utilityFunction(color, boardState),
            color, 4);
    }

}

const biasTable = [
    [4, 1, 2, 1, 1, 2, 1, 4],
    [1, 1, 2, 1, 1, 2, 1, 1],
    [2, 2, 2, 1, 1, 2, 2, 2],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [2, 2, 2, 1, 1, 2, 2, 2],
    [1, 1, 2, 1, 1, 2, 1, 1],
    [4, 1, 2, 1, 1, 2, 1, 4],
];

export class ImprovedAiPlayer extends HeuristicAiPlayer {
    constructor(color) {
        super((color, boardState, move) => {
            if (move === null) return utilityFunction(color, boardState);
            else return utilityFunction(color, boardState) * biasTable[move.x][move.y];
        }, color, 4);
    }
}
