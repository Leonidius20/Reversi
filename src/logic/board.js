import React from 'react'
import { RenderBoard } from "../ui/game";
import {CheckHandler, FlipHandler, DIRECTIONS, iterateCells} from "./board_iterators";

const BLACK = 'black';
const WHITE = 'white';
const AVAILABLE = 'available';
const TIE = 'tie';

export { BLACK, WHITE };

class Board extends React.Component {
    constructor(props) {
        super(props);
        const cellsArray = [];
        for (let i = 0; i < 8; i++) {
            cellsArray[i] = Array(8).fill(null);
        }
        cellsArray[3][3] = BLACK;
        cellsArray[4][4] = BLACK;
        cellsArray[3][4] = WHITE;
        cellsArray[4][3] = WHITE;

        this.state = {
            cells: cellsArray,
            currentPlayer: BLACK,
        };

        this.legalCells = this.getLegalCells(this.state.currentPlayer);

        this.consecutivePasses = 0;
    }

    gameHasEnded() {
        if (this.consecutivePasses === 2) return true;

        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (this.state.cells[i][j] == null) {
                    return false;
                }
            }
        }
        return true;
    }

    calculateWinner() {
        let white = 0;
        let black = 0;
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                switch (this.state.cells[i][j]) {
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
        if (white === black) return TIE;
        if (white > black) return WHITE;
        else return BLACK;
    }

    isLegalClick(row, column) {
        for (const legalCell of this.legalCells) {
            if (legalCell.x === row && legalCell.y === column) {
                return true;
            }
        }
        return false;
    }

    // player's move
    handleClick = (row, column) => {
        if (this.state.cells[row][column] != null
            || !this.isLegalClick(row, column)
            || this.state.currentPlayer !== BLACK
            || this.state.pass === true
            || this.gameHasEnded()) return;

        this.consecutivePasses = 0;

        this.makeMove(BLACK, row, column);

        setTimeout(() => this.computerMove(), 2000);
    }

    computerMove() {
        this.legalCells = []; // so that legal cells are not rendered

        this.setState({
            cells: this.state.cells,
            currentPlayer: WHITE,
            pass: false,
        });

        const legalMoves = this.getLegalCells(WHITE);

        if (legalMoves.length === 0) { // there are no legal moves, passing
            this.setState({
                cells: this.state.cells,
                currentPlayer: WHITE,
                pass: true,
            });
            this.consecutivePasses++;
            setTimeout(() => {
                this.setState({
                    cells: this.state.cells,
                    currentPlayer: BLACK,
                    pass: false,
                });
            }, 2000);
        } else {
            this.consecutivePasses = 0;

            const move = legalMoves[Math.floor(Math.random() * legalMoves.length)];

            this.makeMove(WHITE, move.x, move.y);
        }

        this.setState({
            cells: this.state.cells,
            currentPlayer: BLACK,
            pass: false,
        });

        this.prepareForHumanMove();
    }

    prepareForHumanMove() {
        this.legalCells = this.getLegalCells(BLACK);

        if (this.legalCells.length === 0) {
            this.setState({
                cells: this.state.cells,
                currentPlayer: BLACK,
                pass: true,
            });
            this.consecutivePasses++;
            setTimeout(() => {
                this.computerMove();
            }, 2000);
        }
    }

    makeMove(player, row, column) {
        const cells = this.state.cells.slice();
        cells[row][column] = player;

        // flipping pieces
        for (const direction of DIRECTIONS) {
            const handler = new FlipHandler(player);
            iterateCells(cells, {x: row, y: column}, direction, handler);
            if (handler.flip) {
                for (const piece of handler.piecesToFlip) {
                    cells[piece.x][piece.y] = player;
                }
            }
        }

        // preparing for the next move
        this.legalCells = player === BLACK ? [] : this.getLegalCells(BLACK);

        this.setState({
            cells: cells,
            currentPlayer: player === BLACK ? WHITE : BLACK,
            pass: false,
        });
    }

    // cells which can be taken in the next move
    getLegalCells(player) {
        const cells = [];
        for (let x = 0; x < 8; x++) {
            for (let y = 0; y < 8; y++) {
                // only start iterating from taken spots
                if (this.state.cells[x][y] === player) {

                    // iterate in all directions
                    for (const direction of DIRECTIONS) {
                        const handler = new CheckHandler(player);
                        iterateCells(this.state.cells, {x, y}, direction, handler);
                        if (handler.isValidMove()) cells.push(handler.endPoint);
                    }
                }
            }
        }
        return cells;
    }

    render() {
        // TODO: what if there are no available moves for 1 player or for both
        return <RenderBoard
            winner={this.gameHasEnded() ? this.calculateWinner() : null}
            currentPlayer={this.state.currentPlayer}
            pass={this.state.pass}
            cells={this.state.cells}
            legalCells={this.legalCells}
            handleClick={this.handleClick}/>;
    }
}

export default Board;