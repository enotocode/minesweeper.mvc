'use strict';
/**
 * Browser View of MinesweeperGame
 * @property {DOMElement} bar  - Status bar
 * @property {DOMElement} button  - Start bar
 * @property {DOMElement} field  - Game field
 */
function BrowserView() {
    
    this.eventDispatcher = new EventDispatcher();
};


/**
 * Attaching model and subscribing for events
 * @param {MinesweeperGame} model
 */
BrowserView.prototype.attach = function(model) {
    
    this.model = model;
    var that = this;
    
    this.model.eventDispatcher.subscribe( GameEvent.CELL_OPENED, function (status, cell) {
        that.updateCellStatus(status, cell); 
    });
    this.model.eventDispatcher.subscribe(GameEvent.UPDATE_GAME_STATUS, function (type, status) {
        that.updateGameStatus(status); 
    });
    this.model.eventDispatcher.subscribe( GameEvent.CELL_MARKED, function (status, cell) {
        that.setFlag(cell); 
    });
    this.model.eventDispatcher.subscribe( GameEvent.CELL_UNMARKED, function (status, cell) {
        that.unsetFlag(cell); 
    });
    this.model.eventDispatcher.subscribe( GameEvent.RESTART, function () {
        that.restart();
    });
};

/**
 * Rendering new game field
 */
BrowserView.prototype.render = function() {
    
    this.button = this.createButtons();
    this.insertElement(this.button);
    
    this.mineButton = this.createMineButton();
    this.insertElement(this.mineButton);
    
    this.bar = this.createStatusBar();
    this.insertElement(this.bar);
    
    this.field = this.createTable();
    this.insertElement(this.field);   
    
};

/**
 * Updating status bar
 * @param {String} status
 */
BrowserView.prototype.updateGameStatus = function(status){
    
    this.bar.innerHTML = status;
    
};

/**
 * Updating DOMElement by add class attribute 
 * @param {constant} status - MinesweeperGame's class constant designating cell's status
 * @param {({x:number, y:number}|Object.<Cell>)} cell - Coordinates of element
 */
BrowserView.prototype.updateCellStatus = function(status, cell){
    
    //if ( typeof(cell[0]) === 'object' ) {
    //    cell = cell[0];
    //}    
   
    var id = ViewHelper.createIdFromCoordinates(cell);
      
    var targetCell = document.getElementById(id);
    
    ViewHelper.addClass(targetCell, status);
    targetCell.innerHTML = cell.surroundingMines;
    
    //console.log(cell.x, cell.y, cell.surroundingMines)
};

/**
 * Set flag to cel by add class attribute 
 * @param {Cell} cell - Target cell
 */
BrowserView.prototype.setFlag = function(cell){
    
    var id = ViewHelper.createIdFromCoordinates(cell);      
    var targetCell = document.getElementById(id);
    
    ViewHelper.addClass(targetCell, GameEvent.CELL_MARKED);    
};

/**
 * Unset flag to cel by removing class attribute 
 * @param {Cell} cell - Target cell
 */
BrowserView.prototype.unsetFlag = function(cell){
    
    var id = ViewHelper.createIdFromCoordinates(cell);      
    var targetCell = document.getElementById(id);
    
    ViewHelper.removeClass(targetCell, GameEvent.CELL_MARKED);    
};

/**
 * Re-creating game field
 */
BrowserView.prototype.restart = function() {
    this.field = this.createTable();
    var oldTable = document.getElementById('table');
    var content = this.field.innerHTML;
    oldTable.innerHTML = content;
    console.log('table recreate');
};

/**
 * Generating <table> 10*10 cells
 * @return {DOMElement} table - Html code of table
 */
BrowserView.prototype.createTable = function() {
    
    var tableContent = "";

    for (var i = 0; i < 10; i++) {
        tableContent += "<tr>";
        for (var j = 0; j < 10; j++) {
            tableContent += "<td id=x" + j + "y"+ i + "></td>";        
        }
        tableContent += "</tr>";       
    }
    
    var table = document.createElement('table');
    table.className = "table";    
    table.innerHTML = tableContent;
    table.id = 'table';
    
    var that = this;   

    
    ViewHelper.addDelegateListener(table, 'TD', 'click', function(target) {
        
        var cell = ViewHelper.createCellFromId(target);
            
        that.eventDispatcher.dispatchEvent( new GameEvent(GameEvent.UPDATE_CELL_STATUS, cell) );
        
    });
    
    ViewHelper.addDelegateListener(table, 'TD', 'contextmenu', function(target) {
        
        var cell = ViewHelper.createCellFromId(target);
            
        that.eventDispatcher.dispatchEvent( new GameEvent(GameEvent.CELL_MARKED, cell) );
        
    });
    
    return table;
};

/**
 * Marked mines with '*'
 * @argument {Array.<Cell>} mines - Mined cells
 */
BrowserView.prototype.showMines = function(mines) {
    
    for (var i = 0; i < mines.length; i++) {
        
        var id = ViewHelper.createIdFromCoordinates(mines[i]);
      
        var targetCell = document.getElementById(id);
    
        targetCell.innerHTML = '*';
    }
};

/**
 * Generate controll buttons
 */
BrowserView.prototype.createButtons = function() {
    
    var button = document.createElement('button');
    
    button.type = 'button';    
    button.id = 'new-game';
    button.class = 'button controll';
    button.innerHTML = 'New Game';
    
    var that = this;
    
    button.onclick = function(event){
        var target = event.target;
        that.eventDispatcher.dispatchEvent( new GameEvent(GameEvent.RESTART, target) );
        console.log('restart');
    };
    
    return button;
};

/**
 * Generate controll buttons
 */
BrowserView.prototype.createMineButton = function() {
    
    var button = document.createElement('button');
    
    button.type = 'button';    
    button.id = 'show-mines';
    button.class = 'button controll';
    button.innerHTML = 'Show mines';
    
    var that = this;
    
    button.onclick = function(event){
        var target = event.target;
        that.eventDispatcher.dispatchEvent( new GameEvent(GameEvent.SHOW_MINES, target) );
    };
    
    return button;
};

/**
 * Generate status bar
 */
BrowserView.prototype.createStatusBar = function() {
    
    var bar = document.createElement('div');    
  
    bar.id = 'status-bar';
    bar.class = 'status-bar';
    bar.innerHTML = 'What are you waiting for?';
    
    return bar;
};

/**
 * Injection element in DOM
 * @argument {DONElement} element 
 */
BrowserView.prototype.insertElement = function (element) {
    var parentElenent = document.querySelector('div[class="container"]');
    parentElenent.appendChild(element);
};
