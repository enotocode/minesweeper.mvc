'use strict';

// Export the class
module.exports = ModalController;

// Dependencies
var GameEvent = require('./GameEvent');

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
    this._view.eventDispatcher.subscribe(GameEvent.RESTART, function() {
        that._game.restart();
    }) 
    
}