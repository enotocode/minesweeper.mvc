'use strict';

/**
 * Class EventDispatcher
 * @property {Object} target - Event target
 * @property {Object.<string, Array>} _listeners - Events types and Arrays of functions
 */
function EventDispatcher() {
    this._listeners = {};
}

/**
 * Subscribing method
 * @param {function} listener - Functions that handle the event
 * @param {constant} type
*/
EventDispatcher.prototype.subscribe = function(type, listener) {
   
    if (! (type in this._listeners) ) {
        
        this._listeners[type] = [];
    }
    
    this._listeners[type].push(listener);
}

/**
 * Exec listeners function
 * @param {GameEvent} event - Store type and target of event
 * @property {constant} type - Type of event
 * @property {Object} target - Event target
 */
EventDispatcher.prototype.dispatchEvent = function(event){

    var type = event.type;
    var target = event.target;
        
    if (this._listeners.hasOwnProperty(type)) {
        
        var listeners = this._listeners[type];
        
        for (var i = 0; i < listeners.length; i++) { 
       
            listeners[i](type, target);        
        }        
    }
 }