import logo from './logo.svg';
import Game, {BLACK, WHITE} from "./logic/game";
import './App.css';
import React from "react";
import {RandomAiPlayer, HumanPlayer, GreedyAiPlayer} from "./logic/players";

export default function App() {
    const blackPlayer = new HumanPlayer(BLACK);
    const whitePlayer = new GreedyAiPlayer(WHITE);

  return (
    <div className="App">
      <Game blackPlayer={blackPlayer} whitePlayer={whitePlayer}/>
    </div>
  );
}

/*
<!--<header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>-->
 */