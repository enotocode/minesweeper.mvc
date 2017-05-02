'use strict';

// Export the class
module.exports = MinesweeperGame;

// Dependencies
var GameEvent = require('./GameEvent');
var EventDispatcher = require('./EventDispatcher');
var Cell = require('./Cell');

/**
 * Constructor of the game
 * @property {(MinesweeperGame.STATUS_WIN|MinesweeperGame.STATUS_LOSE|MinesweeperGame.STATUS_PLAYING)} gameStatus - The game status
 * @property {Array.<Cell>} openCells - Opened cells of the gaming field
 * @property {Array.<Cell>} minedCells - Coordinates of mines
 * @property {Array.<Cell>} flaggedCells - Coordinates of flagged cells
 * @property {eventDispatcher} eventDispatcher - Object of EventDispatcher
 */
function MinesweeperGame() {

    this.gameStatus = MinesweeperGame.STATUS_PLAYING;
    this._openCells = [];
    this._minedCells = [];
    this._flaggedCells = [];
    this.eventDispatcher = new EventDispatcher();
}

/**
 * Class constants
 */
MinesweeperGame.STATUS_WIN = 'STATUS_WIN';
MinesweeperGame.STATUS_LOSE = 'STATUS_LOSE';
MinesweeperGame.STATUS_PLAYING = 'STATUS_PLAYING';


/**
 * Creates and digs mines
 * @param {number} mines - Quantity of creating mines
 * @property {Cell} cell - First opened cell
 */
MinesweeperGame.prototype.digMines = function (mines, cell) {

    this._minedCells = [];

    for (var i = 0; i < mines; i++) {
        do {
            var x = random(0, 9);
            var y = random(0, 9);
            var minedCell = new Cell(x, y);
            var cellIsMined = this.isCellMined(minedCell);

            // If minedCell coincides with opened cell or cell is already mined
        } while (x == cell.x && y == cell.y || cellIsMined);
        this._minedCells.push(minedCell);
    }

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
MinesweeperGame.prototype.requestStatus = function () {

    return this.gameStatus;
}

/**
 * Check is cell open
 * @param {Cell} celll - Coordinates of a cell
 * @return {boolean} - True in case the cell is open, false otherwise
 */
MinesweeperGame.prototype.isCellOpen = function (cell) {

    for (var i = 0; i < this._openCells.length; i++) {
        if (this._openCells[i].x == cell.x &&
            this._openCells[i].y == cell.y) {
            return true;
        }
    }
    return false;
}

/**
 * Search mine at the cell
 * @param {Cell} celll - Coordinates of a cell
 * @return {boolean} - True in case the cell is mined, false otherwise
 */
MinesweeperGame.prototype.isCellMined = function (cell) {
    //console.log(cell);

    for (var i = 0; i < this._minedCells.length; i++) {
        //console.log(this._minedCells[i].x, cell.x);
        //console.log(this._minedCells[i].y, cell.y);
        if (this._minedCells[i].x == cell.x &&
            this._minedCells[i].y == cell.y) {
            return true;
        }
    }

    return false;
}

/**
 * How many mines around cell
 * @param {Cell} celll - Coordinates of a cell
 * @return {number} mines - Quantity of mines
 */
MinesweeperGame.prototype.countSurroundingMines = function (cell) {

    // Get neighbors cells
    var neighborsCells = this.getNeighbors(cell, false);
    //console.log('Quant neighbor:', neighborsCells);

    // Sorting
    function sortCell(a, b) {
        var xdif = a.x - b.x;
        if (xdif === 0) {
            return a.y - b.y;
        }
        return xdif;
    }

    var minedCells = this._minedCells.sort(sortCell);
    neighborsCells.sort(sortCell);

    // Calculating intersection
    var m = this._minedCells.length;
    var n = neighborsCells.length;
    var i = 0;
    var j = 0;
    var mines = 0;

    while (i < m && j < n) {

        if (minedCells[i].x == neighborsCells[j].x) {

            if (minedCells[i].y == neighborsCells[j].y) {
                mines++;
                i++;
                j++;
                continue;
            }
            if (minedCells[i].y > neighborsCells[j].y) {
                j++;
            } else {
                i++;
            }
        } else if (minedCells[i].x > neighborsCells[j].x) {
            j++;
        } else {
            i++;
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
MinesweeperGame.prototype.getNeighbors = function (cell, cross) {

    var cells = [];

    // Coordinates of first neighbor
    var x = cell.x - 1;
    var y = cell.y - 1;

    // Quantity of cells from top left cell 
    var endx = 3;
    var endy = 3;

    // Limit coordinates by left and top field's borders
    if (x === -1) {
        x = 0;
        endx = 2;
    }
    if (y === -1) {
        y = 0;
        endy = 2;
    }

    // Limit quantity of cells by right and bottom field's borders
    if (x === 8) {
        endx = 2;
    }
    if (y === 8) {
        endy = 2;
    }

    // Generate neighbor cells
    for (var i = 0; i < endx; i++) {
        for (var j = 0; j < endy; j++) {
            var cellx = x + i;
            var celly = y + j;
            var neighborCell = new Cell(cellx, celly);
            cells.push(neighborCell);
        }
    }

    // Excluding cell itself from cell's neighbor 
    for (var i = 0; i < cells.length; i++) {
        if (cells[i].x == cell.x && cells[i].y == cell.y) {
            cells.splice(i, 1);
            break;
        }
    }

    // Excluding diagonals cells
    if (cross === true) {
        for (var i = 0; i < cells.lenght; i++) {
            if (cells[i].x - cell.x === cells[y] - cell.y) {
                cells.splice(i, 1);
            }
        }
    }
    //console.log(cells);
    return cells
}

/**
 * Set a flag
 * @param {Cell} cell - Coordinates of a cell
 */
MinesweeperGame.prototype.setFlag = function (cell) {

    if (this.isCellOpen(cell)) {
        return;
    }
            
    this._flaggedCells.push(cell);
    this.eventDispatcher.dispatchEvent( new GameEvent(GameEvent.CELL_MARKED, cell) );
}

/**
 * Toggle a flag
 * @param {Cell} cell - Coordinates of a cell
 */
MinesweeperGame.prototype.switchFlag = function(cell) {    

    var index = this.getIndexOfFlagedCell(cell);
       
    if ( index !== null ) {
            
        this.unsetFlag(cell, index);
        
    } else {
        
        this.setFlag(cell);
    }
}

/**
 * Unset a flag
 * @param {Cell} cell - Target cell
 * @param {Number} index - Index of cell in this._flaggedCells array
 */
MinesweeperGame.prototype.unsetFlag = function(cell, index) {
           
    this._flaggedCells.splice(index, 1);
    this.eventDispatcher.dispatchEvent( new GameEvent(GameEvent.CELL_UNMARKED, cell) );
  
}

/**
 * Search cell among flagged cells
 * @param {Cell} cell - Searching cell
 * @returns {Number|null} - Index of cell in this._flaggedCells or null if there is not cell in array
 */
MinesweeperGame.prototype.getIndexOfFlagedCell = function(cell) {
    
    for (var i = 0; i < this._flaggedCells.length; i++) {
        
        if (this._flaggedCells[i].x == cell.x && this._flaggedCells[i].y == cell.y) {
            
            return true;
        }
    }
    
    return null;
}


/**
 * Open the cell
 * @param {(Cell|Object<Cell>)} cell - Opening cell
 * @param {Boolean} recursion - True if the function called in recursion
 * @return {Boolean} - False in case cell is already opened 
 */
MinesweeperGame.prototype.openCell = function (cell, recursion) {
    
    // Start the game
    if (this._openCells.length == 0) {
        this.digMines(12, cell);
        this.updateGameStatus(MinesweeperGame.STATUS_PLAYING);
    }
    
    if (this.isCellOpen(cell) || this.getIndexOfFlagedCell(cell) !== null ) {
        return false;
    }

    // Change game status in case of mine detonating
    if (this.isCellMined(cell)) {
        if (recursion !== true) {
            this.lose()
            return false
        }
        console.log('Watch out!');
        return false
    }

    // Counting quantity of surrounding mines
    var surroundingMines = this.countSurroundingMines(cell);
    cell.surroundingMines = surroundingMines;

    // Add cell to openCells
    this._openCells.push(cell);

    // Dispatching new eventDispatcher
    this.eventDispatcher.dispatchEvent( new GameEvent(GameEvent.CELL_OPENED, cell) );
    
    // Check for winning
    if (this.isWin()) {
        return;
    };

    if (surroundingMines == 0) {
        // Gather cell's neighbors and launch recursion
        var neighbors = this.getNeighbors(cell, true);

        for (var i = 0; i < neighbors.length; i++) {
            this.openCell(neighbors[i], true);
        }
    }

    return true
}

/**
 * Restart the game
 */
MinesweeperGame.prototype.restart = function () {

    this.updateGameStatus(MinesweeperGame.STATUS_PLAYING);
    this._openCells = [];
    this._flaggedCells = [];
    this._minedCells = [];

    this.eventDispatcher.dispatchEvent( new GameEvent(GameEvent.RESTART, this) );
}

/**
 * Lose the game
 */
MinesweeperGame.prototype.lose = function () {

    this.updateGameStatus(MinesweeperGame.STATUS_LOSE);
    this.eventDispatcher.dispatchEvent( new GameEvent(GameEvent.GAME_OVER, this) );
}

/**
 * Get all mines
 */
MinesweeperGame.prototype.getMines = function () {

    return this._minedCells;

}

/**
 * Is player win?
 * @returns {boolean} Returns true in case of winning
 */
MinesweeperGame.prototype.isWin = function () {

    if (this._openCells.length == 100 - this._minedCells.length) {
        this.updateGameStatus(MinesweeperGame.STATUS_WIN);
        return true;
    }
    return false;
}

/**
 * Updating game status
 * @param {(MinesweeperGame.STATUS_WIN|MinesweeperGame.STATUS_LOSE|MinesweeperGame.STATUS_PLAYING)}
 */
MinesweeperGame.prototype.updateGameStatus = function (status) {
    
    this.gameStatus = status;
    this.eventDispatcher.dispatchEvent( new GameEvent(GameEvent.UPDATE_GAME_STATUS, status) );
    
}

