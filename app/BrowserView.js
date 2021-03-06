'use strict';

// Export the class
module.exports = BrowserView;

// Dependencies
var CellEvent = require('./CellEvent');
var ButtonEvent = require('./ButtonEvent');
var ViewHelper = require('./ViewHelper');    
var EventDispatcher = require('./EventDispatcher');
var MinesweeperGame = require('./MinesweeperGame');

/**
 * Browser View of MinesweeperGame
 * @argument {MinesweeperGame} game  - Model
 * @property {MinesweeperGame} _game  - Model
 * @property {DOMElement} bar  - Link on Status bar
 * @property {DOMElement} button  - Link on Start bar
 * @property {DOMElement} mineButton  - Link on 'show mines' button
 * @property {DOMElement} field  - Text field
 * @property {EventDispatcher} eventDispatcher
 */
function BrowserView(game) {
    
    this.bar = null;
    this.button = null;
    this.mineButton = null;
    this.field = null;
    
    this._game = game;    
    this.eventDispatcher = new EventDispatcher();
    this.attach();
    
};

/**
 * Event's types
 */
BrowserView.EVENT_CELL_CLICK_LEFT = 'EVENT_CELL_CLICK_LEFT';
BrowserView.EVENT_CELL_CLICK_RIGHT = 'EVENT_CELL_CLICK_RIGHT';
BrowserView.EVENT_BUTTON_RESTART_CLICK = 'EVENT_BUTTON_RESTART_CLICK';
BrowserView.EVENT_BUTTON_SHOW_MINES_CLICK = 'EVENT_BUTTON_SHOW_MINES_CLICK';

/**
 * Attaching game and subscribing for events
 */
BrowserView.prototype.attach = function() {
    
    var that = this;
    
    this._game.eventDispatcher.subscribe(MinesweeperGame.EVENT_CELL_OPENED, function (event) {
        that.openCell(event.x, event.y); 
    });
    this._game.eventDispatcher.subscribe(MinesweeperGame.EVENT_UPDATE_GAME_STATUS, function (event) {
        that.updateGameStatus(event.status); 
    });
    this._game.eventDispatcher.subscribe(MinesweeperGame.EVENT_CELL_MARKED, function (event) {
        that.setFlag(event.x, event.y); 
    });
    this._game.eventDispatcher.subscribe(MinesweeperGame.EVENT_CELL_UNMARKED, function (event) {
        that.unsetFlag(event.x, event.y); 
    });
    this._game.eventDispatcher.subscribe(MinesweeperGame.EVENT_GAME_RESTART, function (event) {
        that.reload(); 
    });
};

/**
 * Rendering new game field
 */
BrowserView.prototype.render = function() {
    
    this.button = this.createStartButton();
    this.insertElement(this.button);
    
    this.mineButton = this.createMineButton();
    this.insertElement(this.mineButton);
    
    this.bar = this.createStatusBar();
    this.insertElement(this.bar);
    
    this.field = this.createField();
    this.insertElement(this.field);   
    
};

/**
 * Updating status bar
 * @param {String} status
 */
BrowserView.prototype.updateGameStatus = function(status){
    if (status === MinesweeperGame.STATUS_WIN) {
        // freeze
        // modal win
    } else if (status === MinesweeperGame.STATUS_LOSE) {
        // freeze
        // modal lose
    }
    this.bar.innerHTML = status;    
};

/**
 * Updating DOMElement by add class attribute 
 * @param {constant} status - MinesweeperGame's class constant designating cell's status
 * @param {({x:number, y:number}|Object.<Cell>)} cell - Coordinates of element
 */
BrowserView.prototype.openCell = function(x, y){
    
    var targetCell = this.field.rows[y].cells[x];
    
    ViewHelper.addClass(targetCell, 'CELL_OPENED');
    
    var minesQuant = this._game.getMinesQuantity(x, y);
    
    if (minesQuant !== 0) {
        
        targetCell.innerHTML = minesQuant;
    }    
    
};

/**
 * Set flag to cel by add class attribute 
 * @param {Cell} cell - Target cell
 */
BrowserView.prototype.setFlag = function(x, y){
      
    var targetCell = this.field.rows[y].cells[x];
    ViewHelper.addClass(targetCell, 'CELL_MARKED');
};

/**
 * Unset flag to cel by removing class attribute 
 * @param {Cell} cell - Target cell
 */
BrowserView.prototype.unsetFlag = function(x, y){
     
    var targetCell = this.field.rows[y].cells[x];    
    ViewHelper.removeClass(targetCell, 'CELL_MARKED');    
};

/**
 * Re-creating game field
 */
BrowserView.prototype.reload = function() {
    
    var newField = this.createField();
    this.field.innerHTML = newField.innerHTML;

};

/**
 * Generating <table> 10*10 cells
 * @return {DOMElement} table - Html code of table
 */
BrowserView.prototype.createField = function() {
    
    var tableContent = "";

    for (var i = 0; i < 10; i++) {
        tableContent += "<tr>";
        for (var j = 0; j < 10; j++) {
            tableContent += "<td></td>";        
        }
        tableContent += "</tr>";       
    }
    
    var table = document.createElement('table');
    table.className = "field";    
    table.innerHTML = tableContent;
    
    var that = this;   
    
    ViewHelper.addDelegateListener(table, 'TD', 'mousedown', function(targetTD) {
        
        var x = targetTD.cellIndex;
        var y = targetTD.parentElement.rowIndex;
            
        that.eventDispatcher.dispatchEvent( new CellEvent(BrowserView.EVENT_CELL_CLICK_LEFT, x, y) );
        
    }, 1 );
    
    ViewHelper.addDelegateListener(table, 'TD', 'mousedown', function(targetTD) {
        
        var x = targetTD.cellIndex;
        var y = targetTD.parentElement.rowIndex;
            
        that.eventDispatcher.dispatchEvent( new CellEvent(BrowserView.EVENT_CELL_CLICK_RIGHT, x, y) );
        
    }, 3 );
    
    return table;
};

/**
 * Marked mines with '*'
 * @argument {Array.<Cell>} mines - Mined cells
 */
BrowserView.prototype.showMines = function(mines) {
    
    for (var i = 0; i < mines.length; i++) {        
 
        var cell = mines[i];
      
        var targetCell = this.field.rows[cell.y].cells[cell.x];
    
        targetCell.innerHTML = '*';
    }
};

/**
 * Generate control buttons
 */
BrowserView.prototype.createStartButton = function() {
    
    var button = document.createElement('button');
    
    button.type = 'button';    
    button.className = 'button-small pure-button';
    button.innerHTML = 'New Game';
    
    var that = this;
    
    button.onclick = function(event){
        var target = event.target;
        that.eventDispatcher.dispatchEvent( new ButtonEvent(BrowserView.EVENT_BUTTON_RESTART_CLICK, target) );
        console.log('restart');
    };
    
    return button;
};

/**
 * Generate control buttons
 */
BrowserView.prototype.createMineButton = function() {
    
    var button = document.createElement('button');
    
    button.type = 'button';    
    button.className = 'button-small pure-button';
    button.innerHTML = 'Show mines';
    
    var that = this;
    
    button.onclick = function(event){
        var target = event.target;
        that.eventDispatcher.dispatchEvent( new ButtonEvent(BrowserView.EVENT_BUTTON_SHOW_MINES_CLICK, target) );
    };
    
    return button;
};

/**
 * Generate status bar
 */
BrowserView.prototype.createStatusBar = function() {
    
    var bar = document.createElement('div');    

    bar.className = 'status-bar';
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
