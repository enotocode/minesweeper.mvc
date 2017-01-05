'use strict';

/**
 * Console controller class
 * 
 * @property {MinesweeperGame} _model - The game
 * @property {String} _field - Game field
 */
function ConsoleController() {
    
    this._model = null;
    this._field = '';
    this.charSet = {};
    
    this.charSet[GameEvent.CELL_OPENED] = '.';
    this.charSet[GameEvent.CELL_MINED] = '*';
    this.charSet[GameEvent.CELL_MARKED] = 'F';
    this.charSet[GameEvent.CELL_UNMARKED] = '+';
    
};

/**
 * @param   {MinesweeperGame} model - The game
 */
ConsoleController.prototype.attach = function(model) {
    
    this._model = model;
    
    var that = this;
    
    this._model.eventDispatcher.subscribe( GameEvent.CELL_OPENED, function (status, cell) {
        that.updateCellStatus(status, cell);
    });
    //this._model.eventDispatcher.subscribe(GameEvent.UPDATE_GAME_STATUS, function (type, status) {
    //    that.updateGameStatus(status); 
    //});
    this._model.eventDispatcher.subscribe( GameEvent.CELL_MARKED, function (status, cell) {
        that.updateCellStatus(status, cell);
    });
    this._model.eventDispatcher.subscribe( GameEvent.CELL_UNMARKED, function (status, cell) {
        that.updateCellStatus(status, cell);
    });
    //this._model.eventDispatcher.subscribe( GameEvent.RESTART, function () {
    //    that.restart();
    //});    
   
}

/**
 * Replace character-cell in field
 */
ConsoleController.prototype.updateCellStatus = function(status, cell){
    
    if (this._field === "") {
       this.createField();
    }
    
    var charNumber = cell.x * 2 + 20 * cell.y;    
    var newChar = this.charSet[status];    
    var field = this._field;
    
    if (status === GameEvent.CELL_OPENED && cell.surroundingMines !== 0) {
        newChar = cell.surroundingMines;
    }
    
    this._field = field.substring(0, charNumber) + newChar + field.substring(charNumber + 1);    
   
    this.show();
}

/**
 * Draw actual game state in console 
 */
ConsoleController.prototype.show = function() {   
   
    // Print saved field
    console.log(this._field);
    
    // Change cell-symbol in field ./1-8/*
}

/**
 * Generating '+' field
 */
ConsoleController.prototype.createField = function() {
    
    /* Generate '+' field
     * + + .
     * + 1 1 
     * . 1 *
     */
    var field = "";
    
    for ( var i = 0; i < 10; i++ ) {
        
        for ( var j = 0; j < 10; j++ ) {
            
            field += "+ ";            
        }
        // Delete last space and add newline character
        field = field.slice(0, -1) + '\n';       
    }
    
    // Save actual field in this._field
    this._field = field;
}