import React from 'react';
import { CheckHandler, DIRECTIONS, iterateCells } from "./board_iterators";
import { RenderGame } from "../ui/game";
import {applyMove} from "./ai";

export const BLACK = true;
export const WHITE = false;

export default class Game extends React.Component {

    constructor(props) {
        super(props);
        this.blackPlayer = props.blackPlayer;
        this.whitePlayer = props.whitePlayer;
        this.state = Game.getInitialState();
        this.gameLoop();
    }

    static getInitialState() {
        const cellsArray = [];
        for (let i = 0; i < 8; i++) {
            cellsArray[i] = Array(8).fill(null);
        }
        cellsArray[3][3] = BLACK;
        cellsArray[4][4] = BLACK;
        cellsArray[3][4] = WHITE;
        cellsArray[4][3] = WHITE;

        return {
            boardState: cellsArray,
            turnCounter: 0,
            consecutivePasses: 0,
        }
    }

    getCurrentPlayer() {
        return this.state.turnCounter % 2 === 0 ? this.blackPlayer : this.whitePlayer;
    }

    isGameFinished() {
        if (this.state.consecutivePasses === 2) return true;

        for (let i = 0; i < 8; i++) {
            // if there are empty cells on the board
            if (this.state.boardState[i].includes(null)) return false;
        }

        return true;
    }

    registerMove(player, move) {
        this.setState((prevState) => {
            return {
                boardState: applyMove(prevState.boardState, player.color, move),
                turnCounter: prevState.turnCounter + 1,
                consecutivePasses: 0,
            };
        });
        this.forceUpdate();
    }

    async gameLoop() {
        while (!this.isGameFinished()) {
            const player = this.getCurrentPlayer();
            const move = await player.nextMove(this.state.boardState);
            this.registerMove(player, move);
        }

        this.state = {
            boardState: this.state.boardState,
            turnCounter: this.state.turnCounter,
            consecutivePasses: 0,
            winner: this.getWinner(),
        }
    }

    getWinner() {
        let white = 0;
        let black = 0;
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                switch (this.state.boardState[i][j]) {
                    case WHITE:
                        white++;
                        break;
                    case BLACK:
                        black++;
                        break;
                    default:
                        break;
                }
            }
        }
        if (white === black) return 'TIE';
        if (white > black) return 'WHITE';
        else return 'BLACK';
    }

    render() {
        return <RenderGame game={this}/>;
    }

}

export function getPossibleMoves(player, boardState) {
    const possibleMoves = [];
    for (let x = 0; x < 8; x++) {
        for (let y = 0; y < 8; y++) {
            // only start iterating from taken spots
            if (boardState[x][y] === player.color) {

                // iterate in all directions
                for (const direction of DIRECTIONS) {

                    const handler = new CheckHandler(player.color);
                    iterateCells(boardState, {x, y}, direction, handler);
                    if (handler.isValidMove()) possibleMoves.push(handler.getEndPoint());
                }
            }
        }
    }
    return possibleMoves;
}

// utility function (used for terminal positions)
function finalScore() {

}