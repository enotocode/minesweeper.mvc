'use strict';

// Export the class
module.exports = Cell;

/**
 * Cell class
 * 
 * @param   {number} x - X coordinate
 * @param   {number} y - y coordinate
 * @property   {boolean} mine - Mined or not
 * @property   {boolean} surroundingMines - Quantity of mines surrounding cell
 */
function Cell(x, y) {
    this.x = x;
    this.y = y;
    this.mine = false;
    this.surroundingMines = null;
}
