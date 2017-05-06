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
    this._view.eventDispatcher.subscribe(BrowserView.EVENT_BUTTON_RESTART_CLICK, function() {
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
    this._view.eventDispatcher.subscribe(BrowserView.EVENT_BUTTON_SHOW_MINES_CLICK, function() {
        var mines = that._game.getMines();
        that._view.showMines(mines);
    })
    this.addView();
}

BrowserViewController.prototype.addView = function() {
    var view2 = new BrowserView(this._game);
    
    var that = this;
    
    // Restart Game
    view2.eventDispatcher.subscribe(BrowserView.EVENT_BUTTON_RESTART_CLICK, function() {
        that._game.restart();
    })

    
    // Open cell 
    view2.eventDispatcher.subscribe(BrowserView.EVENT_CELL_CLICK_LEFT, function(event) {
        that._game.openCell(event.x, event.y);         
    })

    
    // Switching a flag
    view2.eventDispatcher.subscribe(BrowserView.EVENT_CELL_CLICK_RIGHT, function(event) {
        that._game.switchFlag(event.x, event.y);
    })

    
    // Show mines
    view2.eventDispatcher.subscribe(BrowserView.EVENT_BUTTON_SHOW_MINES_CLICK, function() {
        var mines = that._game.getMines();
        view2.showMines(mines);
    })
    
    view2.render();
}