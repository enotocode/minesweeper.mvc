'use strict';

// Export the class
module.exports = ButtonEvent;


/**
 * GameEvent store type and target of event
 * transferring to observer when event dispatches
 * 
 * @param   {Constant} type - One of the ButtonEvent type
 * 
 */
function ButtonEvent(type) {
    this.type = type;
}