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