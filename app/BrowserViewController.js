'use strict';

// Export the class
module.exports = BrowserViewController;

// Dependencies
var GameEvent = require('./GameEvent');
var BrowserView = require('./BrowserView');
var ModalController = require('./ModalController');
var ModalView = require('./ModalView');
var MinesweeperGame = require('./MinesweeperGame');

/**
 * Controller for browserView
 * 
 * @param   {BrowserView} _view 
 * @param   {MinesweeperGame} _game
 * @param   {ModalController} _modal 
 */
function BrowserViewController(view, game) {
    this._view = view;
    this._game = game;
    this._modal = null;
    
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
    
    this.createModal();
}

/**
 * Create modal window widget
 */
BrowserViewController.prototype.createModal = function() {
    
    // Create modal view and controller
    this._modal = new ModalController(new ModalView(), this._game);
    // Inject modal window DOM object in View
    this._view.insertElement(this._modal.run());
    
    var that = this;
    
    // Order modal window show and hide
    this._game.eventDispatcher.subscribe(MinesweeperGame.EVENT_UPDATE_GAME_STATUS, function (event) {
        if (event.status === MinesweeperGame.STATUS_LOSE ||
            event.status === MinesweeperGame.STATUS_WIN) {
            that._modal.show();
        };
        if (event.status === MinesweeperGame.STATUS_PLAYING) {
            that._modal.hide();
        };        
    });
}

