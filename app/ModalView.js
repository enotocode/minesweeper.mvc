'use strict';

// Export the class
module.exports = ModalView;

// Dependencies
var ButtonEvent = require('./GameEvent');
var EventDispatcher = require('./EventDispatcher');
var ViewHelper = require('./ViewHelper');


/**
 * Modal view
 * @property {DOMElement} _modalWindow - Modal window
 * @property {eventDispatcher} eventDispatcher - Object of EventDispatcher
 */
function ModalView() {
    
    this._modalWindow = null;
    this.eventDispatcher = new EventDispatcher();
    
}

/**
 * Events
 */
ModalView.BUTTON_RESTART_CLICK = 'BUTTON_RESTART_CLICK';

/**
 * Show DOM object with modal window
 */
ModalView.prototype.show = function () {

    ViewHelper.removeClass(this._modalWindow, 'invisible');    
}

/**
 * Hide DOM object with modal window
 */
ModalView.prototype.hide = function () {
    
    ViewHelper.addClass(this._modalWindow, 'invisible');

}

/**
 * Render modal window
 *
 * @returns {DOMObject} this._modalWindow  - Object with modal window
 */
ModalView.prototype.run = function() {

    var modalWindow = this.createWindow();
    this._modalWindow = modalWindow;
    
    // Invisible by defaults
    this.hide();
    
    return this._modalWindow;
}

/**
 * Creating main window
 * 
 * @returns {DOMObject} Modal window
 */
ModalView.prototype.createWindow = function() {
    
    var window = document.createElement('div');
    
    window.className = "modal";
    window.id = 'modal';
    
    var content = document.createElement('div');
    
    content.className = "modal-content";
    content.innerHTML = '<h2>W A S T E D</h2><p>Start new game</p>';
    
    var button = this.createButtons();
    
    content.appendChild(button);       
    window.appendChild(content);
    
    return window;    
}

/**
 * Creating control button
 * 
 * @returns {DOMObject} Button with onclick event listener
 */
ModalView.prototype.createButtons = function() {
    
    var button = document.createElement('button');
    
    button.type = 'button';    
    button.className = 'pure-button';
    button.innerHTML = 'New Game';
    
    var that = this;
    
    button.onclick = function(event){
        
        var target = event.target;
        that.eventDispatcher.dispatchEvent( new ButtonEvent(ModalView.BUTTON_RESTART_CLICK, target) );
    };
    
    return button;
};