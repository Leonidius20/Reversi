// thanks https://stackoverflow.com/a/44738696

import { BLACK, WHITE } from "./board";

const DIRECTIONS = [
    {x: 0, y: 1}, {x: 1, y: 1}, {x: 1, y: 0}, {x: 1, y: -1},
    {x: 0, y: -1}, {x: -1, y: -1}, {x: -1, y: 0}, {x: -1, y: 1}
];

// iteration should start from my pieces only.
const iterateCells = (cells, start, direction, handler) => {
    for (let x = start.x + direction.x, y = start.y + direction.y;
         x >= 0 && x < 8 && y >=0 && y < 8;
         x += direction.x, y += direction.y) {
        if (!handler.handleCell(x, y, cells[x][y])) {
            break;
        }
    }
}

// handler to handle checking
class CheckHandler {

    myColor;
    otherColor;
    hasOtherPieces = false;
    endsWithEmptySpace = false;
    endPoint;

    constructor(myColor) {
        this.myColor = myColor;
        this.otherColor = myColor === WHITE ? BLACK : WHITE;
    }

    // Returns whether the search in this direction should be continued
    handleCell(x, y, value) {
        this.endPoint = {x, y};
        if (value === this.otherColor) {
            this.hasOtherPieces = true;
            return true;
        }
        if (value === this.myColor) {
            return false;
        }
        if (value == null) {
            this.endsWithEmptySpace = true;
            return false;
        }
    }

    isValidMove() {
        return this.hasOtherPieces && this.endsWithEmptySpace;
    }



}

class FlipHandler {
    myColor;
    otherColor;
    flip = false;
    piecesToFlip = [];

    constructor(myColor) {
        this.myColor = myColor;
        this.otherColor = myColor === WHITE ? BLACK : WHITE;
    }

    handleCell(x, y, value) {
        if (value === this.otherColor) {
            this.piecesToFlip.push({x, y});
            return true;
        }
        if (value === this.myColor) {
            this.flip = true;
            return false;
        }
        if (value == null) {
            return false;
        }
    }
}

export { DIRECTIONS, iterateCells, CheckHandler, FlipHandler };