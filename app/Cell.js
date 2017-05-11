'use strict';

// Export the class
module.exports = Cell;

/**
 * Cell class
 * 
 * @property   {boolean} mine - Mined or not
 * @property   {boolean} surroundingMines - Quantity of mines surrounding cell
 */
function Cell() {
    this.surroundingMines = null;
    this.mined = false;
    this.opened = false;
    this.flagged = false;
}
