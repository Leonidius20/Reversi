import MenuButton from "../menu_button/menu_button";
import React from "react";


export default function DifficultySelection(props) {
    return <div>
        <li>
            <ul><MenuButton onClick={() => props.selectDifficulty(1)}>Play</MenuButton></ul>
            <ul><MenuButton onClick={() => props.selectDifficulty(2)}>Play</MenuButton></ul>
            <ul><MenuButton onClick={() => props.selectDifficulty(3)}>Play</MenuButton></ul>

        </li>
    </div>
}