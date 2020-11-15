import Game, {BLACK, WHITE} from "./logic/game";
import './App.css';
import React from "react";
import { HumanPlayer, ImprovedAiPlayer } from "./logic/players";

export default function App() {
    const blackPlayer = new HumanPlayer(BLACK);
    const whitePlayer = new ImprovedAiPlayer(WHITE);

    return (
        <div className="App">
          <Game blackPlayer={blackPlayer} whitePlayer={whitePlayer}/>
        </div>
    );
}