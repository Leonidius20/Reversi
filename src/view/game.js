import React from 'react'
import './game.css'

const BLACK = 'black';
const WHITE = 'white';

class Game extends React.Component {
    render() {
        return (
            <div>
                <Board/>
                Something else
            </div>
        );
    }
}

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

    renderCell(row, column) {
        return <Cell value={this.state.cells[row][column]}
                     onClick={() => this.handleClick(row, column)} key={`${row}_${column}`}/>;
    }

    renderRow(row) {
        const cells = [];
        for (let i = 0; i < this.state.cells[row].length; i++) {
            cells.push(this.renderCell(row, i));
        }
        return <div className="board-row" key={row}>{cells}</div>;
    }

    handleClick(row, column) {
        if (this.state.cells[row][column] != null) return;
        const cells = this.state.cells.slice();
        cells[row][column] = this.state.currentPlayer === BLACK ? BLACK : WHITE;
        this.setState({
            cells: cells,
            currentPlayer: this.state.currentPlayer === BLACK ? WHITE : BLACK,
        });
    }

    render() {
        const text = 'Next player: ' + (this.state.currentPlayer === BLACK ? 'black' : 'white');

        const rows = [];
        for (let i = 0; i < this.state.cells.length; i++) {
            rows.push(this.renderRow(i));
        }

        return (
            <div>
                <div className="status">{text}</div>
                <div className="board">
                    {rows}
                </div>
            </div>
        );
    }
}

function Cell(props) {
    let buttonClass;
    switch (props.value) {
        case WHITE:
            buttonClass = 'board-cell-white';
            break;
        case BLACK:
            buttonClass = 'board-cell-black';
            break;
        default:
            buttonClass = 'board-cell';
            break;
    }

    return (
        <button className={buttonClass} onClick={props.onClick}>

        </button>
    );
}

export { Game };