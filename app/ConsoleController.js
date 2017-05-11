'use strict';

// Export the class
module.exports = ConsoleController;

// Dependencies
var GameEvent = require('./GameEvent');
var MinesweeperGame = require('./MinesweeperGame');

/**
 * Console controller class
 * for game control with text commands (ex: in browser console)
 * 
 * @property {MinesweeperGame} _model - The game
 * @property {String} _field - Game field
 * @property {Object} _charSet  - Chars presenting cell status in text mode
 */
function ConsoleController(model) {
    
    this._model = model;
    this._field = '';
    this._charSet = {};
    
    this._charSet[MinesweeperGame.EVENT_CELL_OPENED] = '.';
    //this._charSet[MinesweeperGame.E] = '*';
    this._charSet[MinesweeperGame.EVENT_CELL_MARKED] = 'F';
    this._charSet[MinesweeperGame.EVENT_CELL_UNMARKED] = '+';
    
    // Subscribing
    var that = this;
    
    this._model.eventDispatcher.subscribe( MinesweeperGame.EVENT_CELL_OPENED, function (event) {
        that.updateCellStatus(event.type, event.x, event.y);
    });
    //this._model.eventDispatcher.subscribe(GameEvent.UPDATE_GAME_STATUS, function (type, status) {
    //    that.updateGameStatus(status); 
    //});
    this._model.eventDispatcher.subscribe( MinesweeperGame.EVENT_CELL_MARKED, function (event) {
        that.updateCellStatus(event.type, event.x, event.y);
    });
    this._model.eventDispatcher.subscribe( MinesweeperGame.EVENT_CELL_UNMARKED, function (status, cell) {
        that.updateCellStatus(event.type, event.x, event.y);
    });
    this._model.eventDispatcher.subscribe( MinesweeperGame.EVENT_GAME_RESTART, function () {
        that.redraw();
    });    
    
};


/**
 * Open cell
 * 
 * @argument {string} - Cell coordinates in chess style: a3, 4b etc
 */
ConsoleController.prototype.open = function(coordinates) {
    
    var cell = this.transformChessCoordinates(coordinates);
    
    if (coordinates && this._model.openCell(cell.x, cell.y)) {
        
        this._model.openCell(cell.x, cell.y);
        
    } else {
        
        console.log("Can't open the cell, probably cell is already opened or flagged");
    }
    
}

/**
 * Set flag
 * 
 * @argument {string} - Cell coordinates in chess style: a3, 4b etc
 */
ConsoleController.prototype.setFlag = function(coordinates) {
    
    var cell = this.transformChessCoordinates(coordinates);
    
    if (coordinates) {
        
        this._model.setFlag(cell.x, cell.y);
        
    }
}

/**
 * Remove flag
 * 
 * @argument {string} - Cell coordinates in chess style: a3, 4b etc
 */
ConsoleController.prototype.removeFlag = function(coordinates) {    
    
    var cell = this.transformChessCoordinates(coordinates);
    
    if (coordinates) {
        
        this._model.unsetFlag(cell.x, cell.y);
        
    }
}

/**
 * Loose
 */
ConsoleController.prototype.resign = function() {
    
    this._model.lose()
    
}

/**
 * Restart game
 */
ConsoleController.prototype.restart = function() {
    
    this._model.restart();
    
}

/**
 * Transform chess style coordinates in {x, y} 
 * 
 * @argument {string} string - Chess style coordinates a3, b1 etc
 * @returns {{x: number, y: number}} - Cell coordinates
 */
ConsoleController.prototype.transformChessCoordinates = function(string) {
    
    var letter = ['A' ,'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    
    // todo: validation of user inputs     
    var x = letter.indexOf(string.match("[a-zA-Z]+")[0].toUpperCase());
    var y = string.match("\\d+")[0] - 1;
    
    // Show hint in console
    if (string.length < 2) {
      console.log("Cell's coordinates must contain at least 2 symbols, ex: a3");
      return null;
    }
    if (x === null) {
      console.log("Cell's first coordinate must be a letter [a-z], ex: a3");
      return null;
    }
    if (y === null) {
      console.log("Cell's second coordinate must be a number [0-100], ex: a3");
      return null;
    }      
    
    return {'x':x, 'y':y};    
}

/**
 * Replace character-cell in field
 */
ConsoleController.prototype.updateCellStatus = function(status, x, y){
    
    if (this._field === "") {
       this.createField();
    }
    
    var charNumber = x * 2 + 20 * y;    
    var newChar = this._charSet[status];    
    var field = this._field;
    var minesQantity = this._model.getMinesQuantity(x, y);

    if (status === MinesweeperGame.EVENT_CELL_OPENED && minesQantity !== 0) {
        newChar = minesQantity;
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

/**
 * Redraw field
 */
ConsoleController.prototype.redraw = function() {
    this.createField();
    this.show();
}