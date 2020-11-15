import React from "react";
import './main_menu.css';
import MenuButton from "../menu_button/menu_button";

export default function MainMenu(props) {
    return <div>
        <li>
            <ul><MenuButton onClick={() => props.play()}>Play</MenuButton></ul>
        </li>
    </div>
}