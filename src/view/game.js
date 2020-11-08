import React from 'react'
import './game.css'

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

        this.state = {cells: cellsArray};
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
        const cells = this.state.cells.slice();
        cells[row][column] = 'X';
        this.setState({cells: cells});
    }

    render() {
        const text = 'Next player: X';

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
    return (
        <button className="board-cell" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

export { Game };