'use strict';

function BrowserViewController(view, game) {
    this._view = view;
    this._game = game;
    
    var that = this;
    
    // Restart Game
    this._view.eventDispatcher.subscribe(MinesweeperGame.RESTART, function() {
        that._game.restart();
    })
    //this._game.eventDispatcher.subscribe(MinesweeperGame.RESTART, function() {
    //    that._view.restart();
    //})
    // Update status bar
    //this._game.eventDispatcher.subscribe(MinesweeperGame.UPDATE_GAME_STATUS, function() {
    //    that._view.updateGameStatus(that._game.requestStatus());
    //})
    
    // Open cell 
    this._view.eventDispatcher.subscribe(MinesweeperGame.UPDATE_CELL_STATUS, function(type, cell) {
        that._game.openCell(cell);         
    })
    //this._game.eventDispatcher.subscribe(MinesweeperGame.CELL_OPENED, function() {
    //    that._view.updateCellStatus(MinesweeperGame.CELL_OPENED, arguments);        
    //})
    
    // Switching a flag
    this._view.eventDispatcher.subscribe(MinesweeperGame.CELL_MARKED, function(type, cell) {
        that._game.switchFlag(type, cell);
    })
    //this._game.eventDispatcher.subscribe(MinesweeperGame.CELL_MARKED, function() {
    //    that._view.switchCellStatus(MinesweeperGame.CELL_MARKED, arguments);
    //})
    //
    //// Winning the game
    //this._game.eventDispatcher.subscribe(MinesweeperGame.STATUS_WIN, function() {
    //    that._view.showModal(MinesweeperGame.STATUS_WIN);        
    //});

    
    // Show mines
    this._view.eventDispatcher.subscribe(MinesweeperGame.SHOW_MINES, function() {
        var mines = that._game.getMines();
        that._view.showMines(mines);
    })

    
}