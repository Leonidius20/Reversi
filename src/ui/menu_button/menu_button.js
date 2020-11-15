import React from "react";
import './menu_button.css';

export default function MenuButton(props) {
    return <button className="menu-button" onClick={props.onClick}>{props.children}</button>;
}