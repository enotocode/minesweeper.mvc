'use strict';

function BrowserViewController(view, game) {
    this._view = view;
    this._game = game;
    
    var that = this;
    
    // Restart Game
    this._view.viewEvent.subscribe(MinesweeperGame.RESTART, function() {
        that._game.restart();
    })
    this._game.gameEvent.subscribe(MinesweeperGame.RESTART, function() {
        that._view.restart();
    })
    // Update status bar
    this._game.gameEvent.subscribe(MinesweeperGame.UPDATE_GAME_STATUS, function() {
        that._view.updateGameStatus(that._game.requestStatus());
    })
    
    // Open cell 
    this._view.viewEvent.subscribe(MinesweeperGame.UPDATE_CELL_STATUS, function() {
        that._game.openCell(arguments);         
    })
    this._game.gameEvent.subscribe(MinesweeperGame.CELL_OPENED, function() {
        that._view.updateCellStatus(MinesweeperGame.CELL_OPENED, arguments);        
    })
    
    // Switching a flag
    this._view.viewEvent.subscribe(MinesweeperGame.CELL_MARKED, function() {
        that._game.switchFlag(arguments);
    })
    this._game.gameEvent.subscribe(MinesweeperGame.CELL_MARKED, function() {
        that._view.switchCellStatus(MinesweeperGame.CELL_MARKED, arguments);
    })
    
    // Winning the game
    this._game.gameEvent.subscribe(MinesweeperGame.STATUS_WIN, function() {
        that._view.showModal(MinesweeperGame.STATUS_WIN);        
    });

    
    // Show mines
    this._view.viewEvent.subscribe(MinesweeperGame.SHOW_MINES, function() {
        var mines = that._game.getMines(arguments);
        that._view.showMines(mines);
    })

    
}