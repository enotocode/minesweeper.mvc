'use strict';

// Export the class
module.exports = BrowserView;

// Dependencies
var GameEvent = require('./GameEvent');
var ViewHelper = require('./ViewHelper');    
var EventDispatcher = require('./EventDispatcher');
var MinesweeperGame = require('./MinesweeperGame');
var Cell = require('./Cell');

/**
 * Browser View of MinesweeperGame
 * @property {DOMElement} bar  - Link on Status bar
 * @property {DOMElement} button  - Link on Start bar
 * @property {DOMElement} mineButton  - Link on 'show mines' button
 * @property {DOMElement} field  - Text field
 * @property {EventDispatcher} eventDispatcher
 */
function BrowserView() {
    
    this.bar = null;
    this.button = null;
    this.mineButton = null;
    this.field = null;
    this.eventDispatcher = new EventDispatcher();
    
};

/**
 * Event's types
 */
BrowserView.EVENT_CELL_CLICK_LEFT = 'EVENT_CELL_CLICK_LEFT';
BrowserView.EVENT_CELL_CLICK_RIGHT = 'EVENT_CELL_CLICK_RIGHT';
BrowserView.EVENT_BUTTON_RESTART_CLICK = 'EVENT_BUTTON_RESTART_CLICK';
BrowserView.EVENT_BUTTON_SHOW_MINES_CLICK = 'EVENT_BUTTON_SHOW_MINES_CLICK';

/**
 * Attaching model and subscribing for events
 * @param {MinesweeperGame} model
 */
BrowserView.prototype.attach = function(model) {
    
    this.model = model;
    var that = this;
    
    this.model.eventDispatcher.subscribe(MinesweeperGame.EVENT_CELL_OPENED, function (status, cell) {
        that.openCell(status, cell); 
    });
    this.model.eventDispatcher.subscribe(MinesweeperGame.EVENT_UPDATE_GAME_STATUS, function (type, status) {
        that.updateGameStatus(status); 
    });
    this.model.eventDispatcher.subscribe(MinesweeperGame.EVENT_CELL_MARKED, function (status, cell) {
        that.setFlag(cell); 
    });
    this.model.eventDispatcher.subscribe(MinesweeperGame.EVENT_CELL_UNMARKED, function (status, cell) {
        that.unsetFlag(cell); 
    });
    this.model.eventDispatcher.subscribe(MinesweeperGame.EVENT_GAME_RESTART, function () {
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
    
    this.field = this.createField();
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
BrowserView.prototype.openCell = function(status, cell){
    
    var targetCell = this.field.rows[cell.y].cells[cell.x];
    
    ViewHelper.addClass(targetCell, 'CELL_OPENED');
    targetCell.innerHTML = cell.surroundingMines;
    
};

/**
 * Set flag to cel by add class attribute 
 * @param {Cell} cell - Target cell
 */
BrowserView.prototype.setFlag = function(cell){
      
    var targetCell = this.field.rows[cell.y].cells[cell.x];
    ViewHelper.addClass(targetCell, 'CELL_MARKED');
};

/**
 * Unset flag to cel by removing class attribute 
 * @param {Cell} cell - Target cell
 */
BrowserView.prototype.unsetFlag = function(cell){
     
    var targetCell = this.field.rows[cell.y].cells[cell.x];    
    ViewHelper.removeClass(targetCell, 'CELL_MARKED');    
};

/**
 * Re-creating game field
 */
BrowserView.prototype.restart = function() {
    
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
    table.className = "table";    
    table.innerHTML = tableContent;
    table.id = 'field';
    
    var that = this;   
    
    ViewHelper.addDelegateListener(table, 'TD', 'mousedown', function(targetTD) {
        
        var cell = new Cell(targetTD.cellIndex, targetTD.parentElement.rowIndex);
            
        that.eventDispatcher.dispatchEvent( new GameEvent(BrowserView.EVENT_CELL_CLICK_LEFT, cell) );
        
    }, 1 );
    
    ViewHelper.addDelegateListener(table, 'TD', 'mousedown', function(targetTD) {
        
        var cell = new Cell(targetTD.cellIndex, targetTD.parentElement.rowIndex);
            
        that.eventDispatcher.dispatchEvent( new GameEvent(BrowserView.EVENT_CELL_CLICK_RIGHT, cell) );
        
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
BrowserView.prototype.createButtons = function() {
    
    var button = document.createElement('button');
    
    button.type = 'button';    
    button.class = 'button control';
    button.innerHTML = 'New Game';
    
    var that = this;
    
    button.onclick = function(event){
        var target = event.target;
        that.eventDispatcher.dispatchEvent( new GameEvent(BrowserView.EVENT_BUTTON_RESTART_CLICK, target) );
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
    button.class = 'button control';
    button.innerHTML = 'Show mines';
    
    var that = this;
    
    button.onclick = function(event){
        var target = event.target;
        that.eventDispatcher.dispatchEvent( new GameEvent(BrowserView.EVENT_BUTTON_SHOW_MINES_CLICK, target) );
    };
    
    return button;
};

/**
 * Generate status bar
 */
BrowserView.prototype.createStatusBar = function() {
    
    var bar = document.createElement('div');    

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
