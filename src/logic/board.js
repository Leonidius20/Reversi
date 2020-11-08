import React from 'react'
import { RenderBoard } from "../ui/game";
import {CheckHandler, DIRECTIONS, iterateCells} from "./board_iterators";

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

        this.state = {
            cells: cellsArray,
            currentPlayer: BLACK,
        };
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
                        return null;
                }
            }
        }
        if (white === black) return TIE;
        if (white > black) return WHITE;
        else return BLACK;
    }

    handleClick = (row, column) => {
        if (this.state.cells[row][column] != null || this.calculateWinner() != null) return;
        const cells = this.state.cells.slice();
        cells[row][column] = this.state.currentPlayer === BLACK ? BLACK : WHITE;
        this.setState({
            cells: cells,
            currentPlayer: this.state.currentPlayer === BLACK ? WHITE : BLACK,
        });
    }

    // cells which can be taken in the next move
    getLegalCells() {
        const cells = [];
        for (let x = 0; x < 8; x++) {
            for (let y = 0; y < 8; y++) {
                // only start iterating from taken spots
                if (this.state.cells[x][y] === this.state.currentPlayer) {

                    // iterate in all directions
                    for (const direction of DIRECTIONS) {
                        const handler = new CheckHandler(this.state.currentPlayer);
                        iterateCells(this.state.cells, {x, y}, direction, handler);
                        if (handler.isValidMove()) cells.push(handler.endPoint);
                    }
                }
            }
        }
        console.log(cells);
        return cells;
    }

    render() {
        return <RenderBoard
            winner={this.calculateWinner()}
            currentPlayer={this.state.currentPlayer}
            cells={this.state.cells}
            legalCells={this.getLegalCells()}
            handleClick={this.handleClick}/>;
    }
}

export default Board;