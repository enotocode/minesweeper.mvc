'use strict';

/**
 * Class GameEvent
 * @property {Object} target - Event target
 * @property {Object.<string, Array>} _listeners - Events types and Arrays of functions
 */
function GameEvent() {
    this._listeners = {};
}


/**
 * Subscribing method
 * @param {function} listener - Functions that handle the event
 * @param {constant} type
*/
GameEvent.prototype.subscribe = function(type, listener) {
    if (! (type in this._listeners) ) {
        this._listeners[type] = [];
    }
    this._listeners[type].push(listener);
}

/**
 * Exec listeners function
 * @param {constant} type - Type of event
 * @param {Object} target - Event target
 */
GameEvent.prototype.dispatchEvent = function(type, target){

    var listeners = this._listeners[type];
    
    for (var i = 0; i < listeners.length; i++) {
        listeners[i](target);
    }
 }