import React from 'react'
import './game.css'
import { BLACK, WHITE, getPossibleMoves } from '../logic/game'

const AVAILABLE = 'available';
const TIE = 'tie';

export class RenderGame extends React.Component {
    render() {
        return (
            <div>
                <RenderBoard game={this.props.game}/>
            </div>
        );
    }
}

export class RenderBoard extends React.Component {

    handleClick(row, column) {
        const game = this.props.game;

        if (game.isGameFinished()
            || game.getCurrentPlayer() !== game.blackPlayer
            || !this.isLegalClick(game, row, column)) return;
        // TODO: return if pass is happening

        game.blackPlayer.makeMove({x: row, y: column});
    }

    isLegalClick(game, row, column) {
        for (const legalCell of getPossibleMoves(game.blackPlayer, game.state.boardState)) {
            if (legalCell.x === row && legalCell.y === column) {
                return true;
            }
        }
        return false;
    }

    renderCell(row, column) {
        const game = this.props.game;

        let value;

        if (game.getCurrentPlayer() !== game.blackPlayer) {
            value = game.state.boardState[row][column];
        } else { // check if this is a legal move
            let isLegal = false;
            const possibleMoves = getPossibleMoves(game.blackPlayer, game.state.boardState);

            for (const legalCell of possibleMoves) {
                if (legalCell.x === row && legalCell.y === column) {
                    isLegal = true;
                    value = AVAILABLE;
                    break;
                }
            }
            if (!isLegal) value = game.state.boardState[row][column];
        }

        return <Cell value={value}
                     onClick={() => this.handleClick(row, column)} key={`${row}_${column}`}/>;
    }

    renderRow(row) {
        const cells = [];
        for (let i = 0; i < this.props.game.state.boardState[row].length; i++) {
            cells.push(this.renderCell(row, i));
        }
        return <div className="board-row" key={row}>{cells}</div>;
    }

    render() {
        const game = this.props.game;
        const gameState = game.state;
        const currentPlayer = game.getCurrentPlayer() === game.blackPlayer ? 'black' : 'white';

        let text;
        if (gameState.winner) {
            if (gameState.winner === TIE) text = 'Tie';
            else text = 'Winner: ' + gameState.winner;
        } else {
            if (gameState.consecutivePasses !== 0) {
                // passing
                const playerWhoPassed = // this is not a typo! prev player passed
                    game.getCurrentPlayer() === game.blackPlayer ? 'white' : 'black';
                text = `Player ${playerWhoPassed}: PASS`;
            }
            else text = 'Next player: ' + currentPlayer;
        }

        const rows = [];
        for (let i = 0; i < gameState.boardState.length; i++) {
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
        case AVAILABLE:
            buttonClass = 'board-cell-available';
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