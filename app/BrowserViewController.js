'use strict';

// Export the class
module.exports = BrowserViewController;

// Dependencies
var GameEvent = require('./GameEvent');
var BrowserView = require('./BrowserView');

/**
 * Controller for browserView
 * 
 * @param   {BrowserView} view
 * @param   {MinesweeperGame} game
 */
function BrowserViewController(view, game) {
    this._view = view;
    this._game = game;
    
    var that = this;
    
    // Restart Game
    this._view.eventDispatcher.subscribe(GameEvent.RESTART, function() {
        that._game.restart();
    })

    
    // Open cell 
    this._view.eventDispatcher.subscribe(BrowserView.EVENT_CELL_CLICK_LEFT, function(type, cell) {
        that._game.openCell(cell);         
    })

    
    // Switching a flag
    this._view.eventDispatcher.subscribe(BrowserView.EVENT_CELL_CLICK_RIGHT, function(type, cell) {
        that._game.switchFlag(cell);
    })

    
    // Show mines
    this._view.eventDispatcher.subscribe(GameEvent.SHOW_MINES, function() {
        var mines = that._game.getMines();
        that._view.showMines(mines);
    })
    
}