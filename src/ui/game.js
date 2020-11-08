import React from 'react'
import Board from "../logic/board";
import './game.css'

const BLACK = 'black';
const WHITE = 'white';
const AVAILABLE = 'available';
const TIE = 'tie';

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

class RenderBoard extends React.Component {

    renderCell(row, column) {
        return <Cell value={this.props.cells[row][column]}
                     onClick={() => this.props.handleClick(row, column)} key={`${row}_${column}`}/>;
    }

    renderRow(row) {
        const cells = [];
        for (let i = 0; i < this.props.cells[row].length; i++) {
            cells.push(this.renderCell(row, i));
        }
        return <div className="board-row" key={row}>{cells}</div>;
    }

    render() {
        let text;
        if (this.props.winner) {
            if (this.props.winner === TIE) text = 'Tie';
            else text = 'Winner: ' + this.props.winner;
        } else {
            text = 'Next player: ' + (this.props.currentPlayer === BLACK ? 'black' : 'white');
        }

        const rows = [];
        for (let i = 0; i < this.props.cells.length; i++) {
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

export { Game, RenderBoard };