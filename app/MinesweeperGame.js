'use strict';
/**
 * Constructor of the game
 * @property {(MinesweeperGame.STATUS_WIN|MinesweeperGame.STATUS_LOSE|MinesweeperGame.STATUS_PLAYING)} gameStatus - The game status
 * @property {Array.<Cell>} openCells - Opened cells of the gaming field
 * @property {Array.<Cell>} minedCells - Coordinates of mines
 * @property {Array.<Cell>} flagedCells - Coordinates of flagged cells
 * @property {eventDispatcher} eventDispatcher - Object of Event
 */
function MinesweeperGame() {

    this.gameStatus = MinesweeperGame.STATUS_PLAYING;
    this.openCells = [];
    this.minedCells = [];
    this.flagedCells = [];
    this.eventDispatcher = new EventDispatcher();
}

/**
 * Class constants
 */
MinesweeperGame.STATUS_WIN = 'STATUS_WIN';
MinesweeperGame.STATUS_LOSE = 'STATUS_LOSE';
MinesweeperGame.STATUS_PLAYING = 'STATUS_PLAYING';

MinesweeperGame.UPDATE_CELL_STATUS = 'UPDATE_CELL_STATUS';
MinesweeperGame.UPDATE_GAME_STATUS = 'UPDATE_GAME_STATUS';

MinesweeperGame.CELL_OPENED = 'CELL_OPENED';
MinesweeperGame.CELL_MINED = 'CELL_MINED';
MinesweeperGame.CELL_MARKED = 'CELL_MARKED';
MinesweeperGame.CELL_UNMARKED = 'CELL_UNMARKED';

MinesweeperGame.SHOW_MINES = 'SHOW_MINES';
MinesweeperGame.RESTART = 'RESTART';

/**
 * Convert DOMElement to cell Object from
 */

/**
 * Creates and digs mines
 * @param {number} mines - Quantity of creating mines
 * @property {Cell} cell - First opened cell
 * @return {Array.<cell>} minedCells - Mines's coordinates
 */
MinesweeperGame.prototype.digMines = function (mines, cell) {

    this.minedCells = [];

    for (var i = 0; i < mines; i++) {
        do {
            var x = random(0, 9);
            var y = random(0, 9);
            var minedCell = new Cell(x, y);
            var cellIsMined = this.isCellMined(minedCell);

            // If minedCell coincides with opened cell or cell is already mined
        } while (x == cell.x && y == cell.y || cellIsMined);
        this.minedCells.push(minedCell);
    }

    // Randomize coordinates
    function random(min, max) {
        var rand = min + Math.random() * (max + 1 - min);
        rand = Math.floor(rand);
        return rand;
    }
    //console.log(this.minedCells);
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

    for (var i = 0; i < this.openCells.length; i++) {
        if (this.openCells[i].x == cell.x &&
            this.openCells[i].y == cell.y) {
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

    for (var i = 0; i < this.minedCells.length; i++) {
        //console.log(this.minedCells[i].x, cell.x);
        //console.log(this.minedCells[i].y, cell.y);
        if (this.minedCells[i].x == cell.x &&
            this.minedCells[i].y == cell.y) {
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

    var minedCells = this.minedCells.sort(sortCell);
    neighborsCells.sort(sortCell);

    // Calculating intersection
    var m = this.minedCells.length;
    var n = neighborsCells.length;
    var i = 0;
    var j = 0;
    var mines = 0;

    while (i < m && j < n) {

        //console.log(minedCells[i].x, neighborsCells[j].x);

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
 * @return {Array.<cell>} cells - Neighbors of the cell
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
 * @param {{x: number, y: number}} cell - Coordinates of a cell
 */
MinesweeperGame.prototype.switchFlag = function (cell) {

    if (typeof (cell[0]) === 'object') {
        cell = cell[0];
    }

    if (this.isCellOpen(cell)) {
        return;
    }

    // Does the cell already flagged?
    for (var i = 0; i < this.flagedCells.length; i++) {
        if (this.flagedCells[i].x == cell.x && this.flagedCells[i].y == cell.y) {
            this.flagedCells.splice(i, 1);
            this.eventDispatcher.dispatchEvent(MinesweeperGame.CELL_UNMARKED, cell);
            return;
        }
    }

    this.flagedCells.push(cell);
    this.eventDispatcher.dispatchEvent(MinesweeperGame.CELL_MARKED, cell);
}

/**
 * Open the cell
 * @param {(Cell|Object<Cell>)} cell - Opening cell
 * @param {boolean} recursion - True if the function called in recursion
 * @return {boolean} - False in case cell is already opened 
 */
MinesweeperGame.prototype.openCell = function (cell, recursion) {

    if (typeof (cell[0]) === 'object') {
        cell = cell[0];
    }

    if (this.openCells.length == 0) {
        this.digMines(12, cell);
    }

    // Return false if cell already opened
    if (this.isCellOpen(cell)) {
        //console.log('Cell is already opened');
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
    //if (surroundingMines !== 0 && recursion === true) {
    //    return false;
    //}
    cell.surroundingMines = surroundingMines;

    // Add cell to openCells & return true
    this.openCells.push(cell);

    // Dispatching new eventDispatcher
    this.eventDispatcher.dispatchEvent(MinesweeperGame.CELL_OPENED, cell);

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
    this.openCells = [];
    this.flagedCells = [];
    this.minedCells = [];

    this.eventDispatcher.dispatchEvent(MinesweeperGame.RESTART, this);
}

/**
 * Lose the game
 */
MinesweeperGame.prototype.lose = function () {

    this.updateGameStatus(MinesweeperGame.STATUS_LOSE);

}

/**
 * Get all mines
 */
MinesweeperGame.prototype.getMines = function () {

    return this.minedCells;

}

/**
 * Is player win?
 * @returns {boolean} Returns true in case of winning
 */
MinesweeperGame.prototype.isWin = function () {

    if (this.openCells.length == 100 - this.minedCells.length) {
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
    this.eventDispatcher.dispatchEvent(MinesweeperGame.UPDATE_GAME_STATUS, status);
}

