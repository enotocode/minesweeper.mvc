'use strict';

// Export the class
module.exports = GameEvent;


/**
 * GameEvent store type and target of event
 * transferring to observer when event dispatches
 * 
 * @param   {Constant} type - One of the GameEvent constant denoting game's event
 * @param   {Object} target - Target object of event
 * 
 */
function GameEvent(type, target) {
    this.type = type;
    this.target = target;
}

/**
 * GameEvent constant describing game's event types
 */
GameEvent.GAME_OVER = 'GAME_OVER';

GameEvent.UPDATE_CELL_STATUS = 'UPDATE_CELL_STATUS';
GameEvent.UPDATE_GAME_STATUS = 'UPDATE_GAME_STATUS';

GameEvent.CELL_OPENED = 'CELL_OPENED';
GameEvent.CELL_MINED = 'CELL_MINED';
GameEvent.CELL_MARKED = 'CELL_MARKED';
GameEvent.CELL_UNMARKED = 'CELL_UNMARKED';

GameEvent.SHOW_MINES = 'SHOW_MINES';
GameEvent.RESTART = 'RESTART';