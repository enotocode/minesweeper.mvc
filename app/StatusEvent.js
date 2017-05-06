'use strict';

// Export the class
module.exports = StatusEvent;

/**
 * CellEvent store type and cell coordinates
 * transferring to observer when event dispatches
 * 
 * @param   {string} type - One of the GameEvent constant denoting game's event
 * @param   {string} status - Game status
 */
function StatusEvent(type) {
    this.type = type;
    this.status = status;
}