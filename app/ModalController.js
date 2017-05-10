'use strict';

// Export the class
module.exports = ModalController;

// Dependencies
var GameEvent = require('./GameEvent');
var MinesweeperGame = require('./MinesweeperGame');
var ModalView = require('./ModalView');

/**
 * Controller for modalView
 * 
 * @param   {modalView} view
 * @param   {MinesweeperGame} game
 */
function ModalController(view, game) {
    
    this._view = view;
    this._game = game;    
  
    var that = this;
    
    // Restart Game
    this._view.eventDispatcher.subscribe(ModalView.BUTTON_RESTART_CLICK, function() {
        that._game.restart();
    })       
}
/**
 * Run windget, use to place widget in DOM
 * 
 * @returns {DOMObject} - DOM Object with modal window
 */
ModalController.prototype.run = function() {    
    
    return this._view.run();
}

/**
 * Hide modal window
 */
ModalController.prototype.hide = function () {
    
    this._view.hide();
}

/**
 * Show modal window
 */
ModalController.prototype.show = function () {
    
    this._view.show();
}