'use strict';

// Export the class
module.exports = MinesweeperGame;

// Dependencies
var GameEvent = require('./GameEvent');
var CellEvent = require('./CellEvent');
var StatusEvent = require('./StatusEvent');
var EventDispatcher = require('./EventDispatcher');
var Cell = require('./Cell');

/**
 * Constructor of the game
 * @property {(MinesweeperGame.STATUS_WIN|MinesweeperGame.STATUS_LOSE|MinesweeperGame.STATUS_PLAYING)} gameStatus - The game status
 * @property {number} _openedCellsCount - Count of opened cells
 * @property {Array.<Array.<Cell>>} _cells - Cells dictionary, indexes of arrays is cell's coordinates
 * @property {eventDispatcher} eventDispatcher - Object of EventDispatcher
 */

function MinesweeperGame() {

    this.gameStatus = MinesweeperGame.STATUS_PLAYING;
    this._openedCellsCount = 0;
    this._cells = [];
    this.eventDispatcher = new EventDispatcher();

}

/**
 * Game status
 */
MinesweeperGame.STATUS_WIN = 'STATUS_WIN';
MinesweeperGame.STATUS_LOSE = 'STATUS_LOSE';
MinesweeperGame.STATUS_PLAYING = 'STATUS_PLAYING';

/**
 * Game event's types
 */
MinesweeperGame.EVENT_CELL_OPENED = 'EVENT_CELL_OPENED';
MinesweeperGame.EVENT_CELL_MARKED = 'EVENT_CELL_MARKED';
MinesweeperGame.EVENT_CELL_UNMARKED = 'EVENT_CELL_UNMARKED';
MinesweeperGame.EVENT_GAME_RESTART = 'EVENT_GAME_RESTART';
//MinesweeperGame.EVENT_GAME_OVER = 'EVENT_GAME_OVER';
MinesweeperGame.EVENT_UPDATE_GAME_STATUS = 'EVENT_UPDATE_GAME_STATUS';


/**
 * Create and fill dictionaries with initial values
 */
MinesweeperGame.prototype.initDictionaries = function() {
    
    for (var i = 0; i < 10; i++) {
        
        this._cells[i] = []
        
        for (var j = 0; j < 10; j++) {
            
            this._cells[i][j] = new Cell();
        }
    }
}

/**
 * Creates and digs mines
 * @param {number} mines - Quantity of creating mines
 * @property {Cell} cell - First opened cell
 */
MinesweeperGame.prototype.digMines = function(mines, initx, inity) {

    var i = 0;

    do {
        var x = random(0, 9);
        var y = random(0, 9);
        var cellIsMined = this.isCellMined(x, y);

        if (x != initx || y != inity && !cellIsMined) {
            
            this._cells[x][y].mined = true;
            i++;
        }
        
    } while (i < mines);

    // Randomize coordinates

    function random(min, max) {
        
        var rand = min + Math.random() * (max + 1 - min);
        rand = Math.floor(rand);
        return rand;
    }
}

/**
 * Request gaming Status
 * @return {(MinesweeperGame.STATUS_WIN|MinesweeperGame.STATUS_LOSE|MinesweeperGame.STATUS_PLAYING)} - The game status
 */
MinesweeperGame.prototype.requestStatus = function() {

    return this.gameStatus;
}

/**
 * Check is cell open
 * @param {number} x - X coordinate of a cell
 * @param {number} y - Y coordinate of a cell
 * @return {Boolean} - True in case the cell is open, false otherwise
 */
MinesweeperGame.prototype.isCellOpen = function(x, y) {

    return this._cells[x][y].opened;
}

/**k
 * Search mine at the cell
 * @param {Cell} cell - Coordinates of a cell
 * @return {Boolean} - True in case the cell is mined, false otherwise
 */
MinesweeperGame.prototype.isCellMined = function(x, y) {

    return this._cells[x][y].mined;
}

/**
 * Returns quantity of surroundings mines
 * @param {Cell} celll - Coordinates of a cell
 * @return {?number} - Quantity of mines
 */
MinesweeperGame.prototype.getMinesQuantity = function(x, y) {

    return this._cells[x][y].surroundingMines;
}

/**
 * How many mines around cell
 * @param {Cell} celll - Coordinates of a cell
 * @return {number} mines - Quantity of mines
 */
MinesweeperGame.prototype.countSurroundingMines = function(x, y) {

    // Get neighbors cells
    var neighborsCells = this.getNeighbors(x, y, false);
    var mines = 0;

    for (var i = 0; i < neighborsCells.length; i++) {
        
        if (this.isCellMined(neighborsCells[i].x, neighborsCells[i].y)) {
            
            mines++;
        }
    }

    return mines;
}

/**
 * Get neighbors of the cell
 * @param {Cell} cell - Coordinates of a cell
 * @param {Boolean} cross - Select vertical & horizontal cells only (except corner's cell)
 * @return {Cell} cells - Neighbors of the cell
 */
MinesweeperGame.prototype.getNeighbors = function(initX, initY, cross) {

    var cells = [];

    // Coordinates of first neighbor
    var neibX = initX - 1;
    var neibY = initY - 1;

    // Quantity of cells from top left cell 
    var endx = 3;
    var endy = 3;

    // Limit coordinates by left and top field's borders
    if (neibX === -1) {
        neibX = 0;
        endx = 2;
    }
    if (neibY === -1) {
        neibY = 0;
        endy = 2;
    }

    // Limit quantity of cells by right and bottom field's borders
    if (neibX === 8) {
        endx = 2;
    }
    if (neibY === 8) {
        endy = 2;
    }

    // Generate neighbor cells
    for (var i = 0; i < endx; i++) {
        
        for (var j = 0; j < endy; j++) {
            
            var cellx = neibX + i;
            var celly = neibY + j;
            var neighborCell = { 'x': cellx, 'y': celly};
            cells.push(neighborCell);
        }
    }

    // Excluding cell itself from cell's neighbor 
    for (var i = 0; i < cells.length; i++) {
        
        if (cells[i].neibX == initX && cells[i].neibY == initY) {
            
            cells.splice(i, 1);
            break;
        }
    }

    // Excluding diagonals cells
    if (cross === true) {
        
        for (var i = 0; i < cells.lenght; i++) {
            
            if (cells[i].neibX - initX === cells[i].neibY - initY) {
                
                cells.splice(i, 1);
            }
        }
    }
    //console.log(cells);
    return cells;
}

/**
 * Set a flag
 * @param {Cell} cell - Coordinates of a cell
 */
MinesweeperGame.prototype.setFlag = function(x, y) {
    
    // If game is over it's time to go outside
    if (this.isOver()) return false;

    if (this.isCellOpen(x, y)) {
        
        return;
    }

    this._cells[x][y].flagged = true;
    this.eventDispatcher.dispatchEvent(new CellEvent(MinesweeperGame.EVENT_CELL_MARKED, x, y));
}

/**
 * Toggle a flag
 * @param {Cell} cell - Coordinates of a cell
 */
MinesweeperGame.prototype.switchFlag = function(x, y) {

    if (this.isCellFlagged(x, y)) {
        
        this.unsetFlag(x, y);

    } else {
        
        this.setFlag(x, y);
    }
}

/**
 * Unset a flag
 * @param {Cell} cell - Target cell
 */
MinesweeperGame.prototype.unsetFlag = function(x, y) {
    
    // If game is over it's time to go outside
    if (this.isOver()) return false;

    this._cells[x][y].flagged = false;
    this.eventDispatcher.dispatchEvent(new CellEvent(MinesweeperGame.EVENT_CELL_UNMARKED, x, y));
}

/**
 * Search cell among flagged cells
 * @param {Cell} cell - Searching cell
 * @returns {Boolean} - True in case cell is flagged
 */
MinesweeperGame.prototype.isCellFlagged = function(x, y) {

    return this._cells[x][y].flagged;
}

/**
 * Open the cell
 * @param {Cell} cell - Opening cell
 * @param {Boolean} recursion - True if the function called in recursion
 * @return {Boolean} - False in case cell is already opened 
 */
MinesweeperGame.prototype.openCell = function(x, y, recursion) {
    
    // If game is over it's time to go outside
    if (this.isOver()) return false;
    
    // Start the game
    // TODO check status
    if (this._openedCellsCount == 0) {
        
        this.initDictionaries();
        this.digMines(12, x, y);
        this.updateGameStatus(MinesweeperGame.STATUS_PLAYING);
    }

    if (this.isCellOpen(x, y) || this.isCellFlagged(x, y)) {
        
        return false;
    }

    // Change game status in case of mine detonating
    if (this.isCellMined(x, y)) {
        
        if (recursion !== true) {
            
            this.lose()
            return false
        }
        return false
    }

    // Add cell to openCells
    this._cells[x][y].opened = true;
    this._openedCellsCount++;
    
    // Counting quantity of surrounding mines
    var surroundingMines = this.countSurroundingMines(x, y);
    this._cells[x][y].surroundingMines = surroundingMines;

    // Dispatching new eventDispatcher
    this.eventDispatcher.dispatchEvent(new CellEvent(MinesweeperGame.EVENT_CELL_OPENED, x, y));

    // Check for winning
    if (this.isWin()) {
        return;
    };

    if (surroundingMines == 0) {
        // Gather cell's neighbors and launch recursion
        var neighbors = this.getNeighbors(x, y, true);

        for (var i = 0; i < neighbors.length; i++) {
            
            this.openCell(neighbors[i].x, neighbors[i].y, true);
        }
    }

    return true
}

/**
 * Restart the game
 */
MinesweeperGame.prototype.restart = function() {
    
    this._cells = [];
    this._openedCellsCount = 0;

    this.eventDispatcher.dispatchEvent(new GameEvent(MinesweeperGame.EVENT_GAME_RESTART));
    this.updateGameStatus(MinesweeperGame.STATUS_PLAYING);
}

/**
 * Lose the game
 */
MinesweeperGame.prototype.lose = function() {
    
    this.updateGameStatus(MinesweeperGame.STATUS_LOSE);
    //this.eventDispatcher.dispatchEvent(new StatusEvent(MinesweeperGame.STATUS_LOSE, this));
    
}

/**
 * Get all mines
 */
MinesweeperGame.prototype.getMines = function() {

    var minedCells = [];
    
    for (var x = 0; x < 10; x++) {
        
        for (var y = 0; y < 10; y++) {
            
            if (this._cells[x][y].mined) {
                
                minedCells.push({'x': x, 'y': y});
            }
        }
    }

    return minedCells;
}

/**
 * Is player win?
 * @returns {boolean} Returns true in case of winning
 */
MinesweeperGame.prototype.isWin = function() {

    if (this._openedCellsCount == 100 - 12) {
        
        this.updateGameStatus(MinesweeperGame.STATUS_WIN);
        return true
    
    }
    return false;
}

/**
 * Updating game status
 * @param {(MinesweeperGame.STATUS_WIN|MinesweeperGame.STATUS_LOSE|MinesweeperGame.STATUS_PLAYING)}
 */
MinesweeperGame.prototype.updateGameStatus = function(status) {

    this.gameStatus = status;
    this.eventDispatcher.dispatchEvent(new StatusEvent(MinesweeperGame.EVENT_UPDATE_GAME_STATUS, status));

}
/**
 * Is game over
 * 
 * @returns {Boolean} - True in case gamer lose or win
 */
MinesweeperGame.prototype.isOver = function() {    
   
    if (this.gameStatus === MinesweeperGame.STATUS_LOSE ||
        this.gameStatus === MinesweeperGame.STATUS_WIN) {
        
        return true;
    
    }         
    return false;
}