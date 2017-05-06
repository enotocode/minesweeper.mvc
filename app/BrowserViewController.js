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
    view.eventDispatcher.subscribe(BrowserView.EVENT_BUTTON_RESTART_CLICK, function() {
        that._game.restart();
    })

    
    // Open cell 
    view.eventDispatcher.subscribe(BrowserView.EVENT_CELL_CLICK_LEFT, function(event) {
        that._game.openCell(event.x, event.y);         
    })

    
    // Switching a flag
    view.eventDispatcher.subscribe(BrowserView.EVENT_CELL_CLICK_RIGHT, function(event) {
        that._game.switchFlag(event.x, event.y);
    })

    
    // Show mines
    view.eventDispatcher.subscribe(BrowserView.EVENT_BUTTON_SHOW_MINES_CLICK, function() {
        var mines = that._game.getMines();
        view.showMines(mines);
    })
}

