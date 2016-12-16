'use strict';
/**
 * Constructor of the game
 * @property {(MinesweeperGame.STATUS_WIN|MinesweeperGame.STATUS_LOSE|MinesweeperGame.STATUS_PLAYING)} gameStatus - The game status
 * @property {Array.<cell>} openCells - Opened cells of the gaming field
 * @property {Array.<cell>} minedCells - Coordinates of mines
 * @property {Array.<cell>} flagedCells - Coordinates of flaged cells
 * @property {{x: number, y: number}} cell - Coordinates of a cell of the gaming field
 */
function MinesweeperGame () {
    
    this.gameStatus = MinesweeperGame.STATUS_PLAYING;
    this.openCells = [];
    this.minedCells =[];
    this.flagedCells = [];
}

/**
 * Class constants
 */
MinesweeperGame.STATUS_WIN = 'win';
MinesweeperGame.STATUS_LOSE = 'lose';
MinesweeperGame.STATUS_PLAYING = 'playing';

/**
 * Creates and digs mines
 * @param {number} mines - Quantity of creating mines
 * @property {{x: number, y: number}} cell - Coordinates of the first opened cell
 * @return {Array.<cell>} minedCells - Mines's coordinates
 */
MinesweeperGame.prototype.digTheMines = function(mines, cell){
    
    var minedCells = [];
    
    for (var i = 0; i < mines; i++){
        do {
            var x = random(10);
            var y = random(10);
        } while (x == cell.x && y == cell.y);
        minedCells.push({'x': x, 'y': y});
    }
    
    // Randomize coordinates
    function random(max) {
        var rand = 0.5 + Math.random() * max
        rand = Math.round(rand);
        return rand;
    }
    
    return minedCells;    
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
 * @param {{x: number, y: number}} celll - Coordinates of a cell
 * @return {boolean} - True in case the cell is open, false otherwise
 */
MinesweeperGame.prototype.isCellOpen = function(cell) {

    for (var i = 0; i > this.openCells.length; i++) {
        if (this.openCells[i].x == cell.x &&
            this.openCells[i].y == cell.y) {
            return true;
        }
    }
    
    return false;
}

/**
 * Search mine at the cell
 * @param {{x: number, y: number}} celll - Coordinates of a cell
 * @return {boolean} - True in case the cell is mined, false otherwise
 */
MinesweeperGame.prototype.isCellMined = function(cell) {

    for (var i = 0; i > this.minedCells.length; i++) {
        if (this.minedCells[i].x == cell.x &&
            this.minedCells[i].y == cell.y) {
            return true;
        }
    }
    
    return false;
}

/**
 * How many mines around cell
 * @param {{x: number, y: number}} celll - Coordinates of a cell
 * @return {number} mines - Quantity of mines
 */
MinesweeperGame.prototype.howManyMines = function(cell) {
    
    // Get neighbors cells
    var neighborsCells = MinesweeperGame.getNeighbors(cell);
    
    // Sorting
    function sortCell(a, b) {
        var xdif = a.x - b.x;
        if (xdif === 0) {
            return a.y - b.y;
        }
        return xdif;       
   }
   this.minedCells.sort(sortCell);
   neighborsCells.sort(sortCell);   
    
   // Calculating intersection
   var m = mineCells.length;
   var n = neighborsCells.length;
   var i = 0;
   var j = 0;
   var mines = 0;
   
   while ( i < m && j < n) {
        if (mineCells[i].x == neighborsCells[j].x) {
            
            if (minedCells[i].y == neighborsCells[j].y) {
                mines++;
                i++;
                j++;
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
 * @param {{x: number, y: number}} cell - Coordinates of a cell
 * @return {Array.<cell>} cells - Neighbors of the cell
 */
MinesweeperGame.prototype.getNeighbors = function(cell) {
    
    var cells = [];
    
    // Coordinates of first neighbor
    var x = cell.x - 1;
    var y = cell.y - 1;
    
    // Quantity of cells from top left cell 
    var endx = 3;
    var endy = 3;
    
    // Limit coordinates by left and top field's borders
    if (cell.x === 1) {
        x = 1;
        endx = 2;        
    }
    if (cell.y === 1) {
        y = 1;
        endx = 2;
    }
    
    // Limit quantity of cells by right and bottom field's borders
    if (cell.x === 10) {
        endx = 2;
    }
    if (cell.y === 10) {
        endy = 2;
    }
    
    // Generate neighbor cells
    for (var i = 0; i < endx; i++){
        for (var j = 0; j < endy; j++) {
            var cellx = x + i;
            var celly = y + j;
            cells.push({'x': cellx, 'y': celly});
        }
    }
    
    // Excluding from cell's neighbor itself
    for (var i = 0; i < cells.length; i++){
        if (cells.x == cell.x && cells.y == cell.y) {
            cells.splice(i, 1);
            break;
        }
    }
    
    return cells;
}

/**
 * Set a flag
 * @param {{x: number, y: number}} cell - Coordinates of a cell
 * @return {(boolean|object)} - Returns true in case setted flag, otherwise cell's coordinates with unsetted flag
 */
MinesweeperGame.prototype.switchFlag = function(cell) {
    
    for(var i = 0; i > this.flagedCells.length; i++){
        if (this.flagedCells[i].x == cell.x && this.flagedCells[i].y == cell.y) {            
            return this.flagedCells.splice(i, 1);
        }
    }
    
    this.flagedCells.push(cell);
    
    return true;
}

/**
 * Open the cell
 * @param {{x: number, y: number}} cell - Coordinates of a cell
 * @return {boolean} - False in case already opened cell
 */
MinesweeperGame.prototype.openTheCell = function(cell) {
    
    if (this.openCells.length == 0) {
        this.openCells.push(cell);
        this.minedCells = MinesweeperGame.digTheMines(10, cell);
        return true;
    }
    
    // Return false if cell already opened
    if (this.isCellOpen(cell)) {
        return false;
    }
    
    // Change game status in case of mine detonating
    if (this.cellIsMined(cell)) {
        this.gameStatus = MinesweeperGame.STATUS_LOSE;
    }
    
    // Add cell to openCells & return true
    this.openCells.push(cell);    
    return true

}

/**
 * Restart the game
 */
MinesweeperGame.prototype.restart = function() {
    
    this.gameStatus = MinesweeperGame.STATUS_PLAYING;
    this.openCells = [];
    this.flagedCells = [];
    this.minedCells = [];
    
}

/**
 * Lose the game
 */
MinesweeperGame.prototype.lose = function() {
    
    this.gameStatus = MinesweeperGame.STATUS_LOSE;
    
}

/**
 * Get all mines
 */
MinesweeperGame.prototype.showMines = function() {
    
    return this.minedCells;

}
