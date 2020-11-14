import { getPossibleMoves } from "./game";
import { TreeNode, applyMove, utilityFunction } from "./ai";

class Player {
    constructor(color, isHuman) {
        this.color = color;
        this.isHuman = isHuman;
    }
}

export class HumanPlayer extends Player {

    constructor(color) {
        super(color, true);
    }

    makeMove(move) {
        this.resolvePromise(move);
    }

    nextMove() {
        return new Promise(((resolve) => {
            this.resolvePromise = resolve;
        }));
    }

}

class AiPlayer extends Player {

    constructor(color) {
        super(color, false);
    }

}

export class RandomAiPlayer extends AiPlayer {

    nextMove(boardState) {
        const moves = getPossibleMoves(this, boardState);
        console.log(moves.length);
        return Promise.resolve(moves[Math.floor(Math.random() * moves.length)]);
    }

}

class HeuristicAiPlayer extends AiPlayer {

    constructor(heuristic, color, maxDepth) {
        super(color);
        this.heuristic = heuristic;
        this.maxDepth = maxDepth;
    }

    nextMove(boardState) {
        const result = this.minmax(0,
            new TreeNode(boardState, null), null, this.color);
        return Promise.resolve(result.move);
    }

    minmax(currentDepth, node, currentMove, currentColor) {
        if (currentDepth === this.maxDepth || node.isTerminalState()) {
            node.value = this.heuristic(this.color, node.boardState);
            return { node: node, move: currentMove };
        }

        let bestValue = -1;
        let bestNode = null;
        let bestMove = null;

        for (const move of getPossibleMoves(this, node.boardState)) {
            const newBoardState = applyMove(node.boardState, currentColor, move);
            const newNode = new TreeNode(newBoardState, null);

            const newEvaluatedNode = this.minmax(currentDepth + 1, newNode, !currentColor).node;

            if (bestValue < newEvaluatedNode.value) {
                bestValue = newEvaluatedNode.value;
                bestNode = newEvaluatedNode;
                bestMove = move;
            }
        }

        return { node: bestNode, move: bestMove };
    }

}

export class GreedyAiPlayer extends HeuristicAiPlayer {

    constructor(color) {
        super((color, boardState) => utilityFunction(color, boardState),
            color, 6);
    }

}