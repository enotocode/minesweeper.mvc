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
 * @property {integer} _openedCellsCount - Count of opened cells
 * @property {Array.<Array.<Cell>>} _cells - Opened cells of the gaming field
 * @property {Array.<Array.<Boolean>>} _openedCells - Dictionary of opened cells, indexes of arrays is cell's coordinates
 * @property {Array.<Array.<Boolean>>} _minedCells - Dictionary of mined cells
 * @property {Array.<Array.<Boolean>>} _flaggedCells - Dictionary of flagged cells
 * @property {eventDispatcher} eventDispatcher - Object of EventDispatcher
 */

function MinesweeperGame() {

    this.gameStatus = MinesweeperGame.STATUS_PLAYING;
    this._openedCellsCount = 0;
    this._cells = [];
    this._openedCells = [];
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
 * Create and fill dictionaries with initial values
 */
MinesweeperGame.prototype.initDictionaries = function() {
    for (var i = 0; i < 10; i++) {
        this._openedCells[i] = [];
        this._minedCells[i] = [];
        this._cells[i] = []
        this._flaggedCells[i] = [];
        for (var j = 0; j < 10; j++) {
            this._openedCells[i][j] = false;
            this._minedCells[i][j] = false;
            this._flaggedCells[i][j] = false;
        }
    }
}

/**
 * Creates and digs mines
 * @param {number} mines - Quantity of creating mines
 * @property {Cell} cell - First opened cell
 */
MinesweeperGame.prototype.digMines = function(mines, cell) {

    var i = 0;

    do {
        var x = random(0, 9);
        var y = random(0, 9);
        //var minedCell = new Cell(x, y);
        var cellIsMined = this.isCellMined(new Cell(x, y));

        if (x != cell.x || y != cell.y && !cellIsMined) {
            this._minedCells[x][y] = true;
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
 * @param {Cell} cell - Coordinates of a cell
 * @return {Boolean} - True in case the cell is open, false otherwise
 */
MinesweeperGame.prototype.isCellOpen = function(cell) {

    return this._openedCells[cell.x][cell.y];
}

/**
 * Search mine at the cell
 * @param {Cell} cell - Coordinates of a cell
 * @return {Boolean} - True in case the cell is mined, false otherwise
 */
MinesweeperGame.prototype.isCellMined = function(cell) {

    return this._minedCells[cell.x][cell.y];
}

/**
 * Returns quantity of surroundings mines
 * @param {Cell} celll - Coordinates of a cell
 * @return {?number} - Quantity of mines
 */
MinesweeperGame.prototype.getSurroundingMines = function(cell) {

    return this._openedCells[cell.x][cell.y];
}

/**
 * How many mines around cell
 * @param {Cell} celll - Coordinates of a cell
 * @return {number} mines - Quantity of mines
 */
MinesweeperGame.prototype.countSurroundingMines = function(cell) {

    // Get neighbors cells
    var neighborsCells = this.getNeighbors(cell, false);
    var mines = 0;

    for (var i = 0; i < neighborsCells.length; i++) {
        if (this.isCellMined(neighborsCells[i])) {
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
MinesweeperGame.prototype.getNeighbors = function(cell, cross) {

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
MinesweeperGame.prototype.setFlag = function(cell) {

    if (this.isCellOpen(cell)) {
        return;
    }

    this._flaggedCells[cell.x][cell.y] = true;
    this.eventDispatcher.dispatchEvent(new GameEvent(GameEvent.CELL_MARKED, cell));
}

/**
 * Toggle a flag
 * @param {Cell} cell - Coordinates of a cell
 */
MinesweeperGame.prototype.switchFlag = function(cell) {

    if (this.isCellFlagged(cell)) {
        this.unsetFlag(cell);

    } else {
        this.setFlag(cell);
    }
}

/**
 * Unset a flag
 * @param {Cell} cell - Target cell

 */
MinesweeperGame.prototype.unsetFlag = function(cell) {

    this._flaggedCells[cell.x][cell.y] = false;
    this.eventDispatcher.dispatchEvent(new GameEvent(GameEvent.CELL_UNMARKED, cell));
}

/**
 * Search cell among flagged cells
 * @param {Cell} cell - Searching cell
 * @returns {Number|null} - Index of cell in this._flaggedCells or null if there is not cell in array
 */
MinesweeperGame.prototype.isCellFlagged = function(cell) {

    return this._flaggedCells[cell.x][cell.y];
}

/**
 * Open the cell
 * @param {Cell} cell - Opening cell
 * @param {Boolean} recursion - True if the function called in recursion
 * @return {Boolean} - False in case cell is already opened 
 */
MinesweeperGame.prototype.openCell = function(cell, recursion) {

    // Start the game
    if (this._openedCellsCount == 0) {
        this.initDictionaries();
        this.digMines(12, cell);
        this.updateGameStatus(MinesweeperGame.STATUS_PLAYING);
    }

    if (this.isCellOpen(cell) || this.isCellFlagged(cell)) {
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
    this._openedCells[cell.x][cell.y] = true;
    this._cells[cell.x][cell.y] = cell;
    this._openedCellsCount++;

    // Dispatching new eventDispatcher
    this.eventDispatcher.dispatchEvent(new GameEvent(GameEvent.CELL_OPENED, cell));

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
MinesweeperGame.prototype.restart = function() {

    this.updateGameStatus(MinesweeperGame.STATUS_PLAYING);
    this._openedCells = [];
    this._flaggedCells = [];
    this._minedCells = [];
    this._cells = [];
    this._openedCellsCount = 0;

    this.eventDispatcher.dispatchEvent(new GameEvent(GameEvent.RESTART, this));
}

/**
 * Lose the game
 */
MinesweeperGame.prototype.lose = function() {

    this.updateGameStatus(MinesweeperGame.STATUS_LOSE);
    this.eventDispatcher.dispatchEvent(new GameEvent(GameEvent.GAME_OVER, this));
}

/**
 * Get all mines
 */
MinesweeperGame.prototype.getMines = function() {

    var minedCells = [];
    for (var x = 0; x < this._minedCells.length; x++) {
        for (var y = 0; y < this._minedCells.length; y++) {
            if (this._minedCells[x][y]) {
                minedCells.push(new Cell(x, y));
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

    //if (this._openedCells.length == 100 - this._minedCells.length) {
    if (this._openedCellsCount == 100 - 12) {
        this.updateGameStatus(MinesweeperGame.STATUS_WIN);
        return true;
    }
    return false;
}

/**
 * Updating game status
 * @param {(MinesweeperGame.STATUS_WIN|MinesweeperGame.STATUS_LOSE|MinesweeperGame.STATUS_PLAYING)}
 */
MinesweeperGame.prototype.updateGameStatus = function(status) {

    this.gameStatus = status;
    this.eventDispatcher.dispatchEvent(new GameEvent(GameEvent.UPDATE_GAME_STATUS, status));

}