'use strict';

// Export the class
module.exports = CellEvent;

/**
 * CellEvent store type and cell coordinates
 * transferring to observer when event dispatches
 * 
 * @param   {string} type - One of the GameEvent constant denoting game's event
 * @param   {number} x - X coordinate of cell
 * @param   {number} y - Y coordinate of cell
 * 
 */
function CellEvent(type, x, y) {
    this.type = type;
    this.x = x;
    this.y = y;
}