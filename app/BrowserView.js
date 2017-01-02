'use strict';
/**
 * Browser View of MinesweeperGame
 * @property {DOMElement} bar  - Status bar
 * @property {DOMElement} button  - Start bar
 * @property {DOMElement} field  - Game field
 */
function BrowserView() {
    this.viewEvent = new GameEvent();
};


/**
 * Attaching model and subscribing for events
 * @param {MinesweeperGame} model
 */
BrowserView.prototype.attach = function(model) {
    
    this.model = model;
    var that = this;
    
    this.model.gameEvent.subscribe(GameEvent.OPEN_CELL, function (e) {
        that.updateCellStatus(arguments); 
    });
    this.model.gameEvent.subscribe(GameEvent.UPDATE_GAME_STATUS, function (e) {
        that.updateGameStatus(arguments); 
    });
}

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
    
}

BrowserView.prototype.updateGameStatus = function(status){
    this.bar.innerHTML = status;
}
/**
 * Updating DOMElement by add class attribute 
 * @param {constant} status - MinesweeperGame's class constant designating cell's status
 * @param { ( {x:number, y:number}|Object<x:number, y:number> ) } cell - Coordinates of element
 */
BrowserView.prototype.updateCellStatus = function(status, cell){
    
    if ( typeof(cell[0]) === 'object' ) {
        cell = cell[0];
    }    
   
    var id = ViewHelper.createIdFromCoordinates(cell);
      
    var targetCell = document.getElementById(id);
    
    ViewHelper.addClass(targetCell, status);
    targetCell.innerHTML = cell.surroundingMines;
    
    //console.log(cell.x, cell.y, cell.surroundingMines)
}

/**
 * Switching DOMElement's status by add or remove class attribute 
 * @param {constant} status - MinesweeperGame's class constant designating cell's status
 * @param { ( {x:number, y:number}|Object<x:number, y:number> ) } cell - Coordinates of element
 */
BrowserView.prototype.switchCellStatus = function(status, cell){
    
    if ( typeof(cell[0]) === 'object' ) {
        cell = cell[0];
    }    
   
    var id = ViewHelper.createIdFromCoordinates(cell);
      
    var targetCell = document.getElementById(id);
    
    var hasStatus = ViewHelper.hasClass(targetCell, status);
    
    if (hasStatus) {
        ViewHelper.removeClass(targetCell, status);
    } else {
        ViewHelper.addClass(targetCell, status);
    }

}

BrowserView.prototype.restart = function() {
    this.field = this.createTable();
    var oldTable = document.getElementById('table');
    var content = this.field.innerHTML;
    oldTable.innerHTML = content;
    console.log('table recreate');
}

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
    
    table.onclick = function(event) {
        var target = event.target;
      
        // цикл двигается вверх от target к родителям до table
        while (target != table) {
          if (target.tagName == 'TD') {
            // нашли элемент, который нас интересует!
            
            var cell = ViewHelper.createCellFromId(target);
            
            that.viewEvent.dispatchEvent(MinesweeperGame.UPDATE_CELL_STATUS, cell );
            
            return;
          }
          target = target.parentNode;
        }
    }
    
    table.oncontextmenu = function(event) {
        console.log('Right click');
        var target = event.target;
      
        // цикл двигается вверх от target к родителям до table
        while (target != table) {
          if (target.tagName == 'TD') {
            // нашли элемент, который нас интересует!
            
            var cell = ViewHelper.createCellFromId(target);
            
            that.viewEvent.dispatchEvent(MinesweeperGame.CELL_MARKED, cell);
            
            return;
          }
          target = target.parentNode;
        }
    }
    
    return table;
}

BrowserView.prototype.showMines = function(mines) {
    for (var i = 0; i < mines.length; i++) {
        
        var id = ViewHelper.createIdFromCoordinates(mines[i]);
      
        var targetCell = document.getElementById(id);
    
        targetCell.innerHTML = '*';
    }
}

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
        that.viewEvent.dispatchEvent(MinesweeperGame.RESTART, target);
        console.log('restart');
    };
    
    return button;
}

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
        that.viewEvent.dispatchEvent(MinesweeperGame.SHOW_MINES, target);
    };
    
    return button;
}

/**
 * Generate status bar
 */
BrowserView.prototype.createStatusBar = function() {
    
    var bar = document.createElement('div');    
  
    bar.id = 'status-bar';
    bar.class = 'status-bar';
    bar.innerHTML = 'What are you waiting for?';
    
    return bar;
}

/**
 * Injection element in DOM
 */
BrowserView.prototype.insertElement = function (element) {
    var parentElenent = document.querySelector('div[class="container"]');
    parentElenent.appendChild(element);
}


//
//// Обработчик таблицы
//document.getElementById('field').onclick = function(event) {  
//  var target = event.target;  
//  
//  // цикл двигается вверх от target к родителям до table
//  while (target != table) {    
//    if (target.tagName == 'TD') {
//      // нашли элемент, который нас интересует!
//      switchColor(target);
//      return;
//    }
//    target = target.parentNode;
//  }
//}
//
//// Обработчик кнопки
//document.getElementById('switchButton').onclick = function(){
//  var field = document.getElementById('field');
//  if (hasClass(field, 'invert')) {
//      removeClass(field, 'invert');
//  } else {
//      addClass(field, 'invert');
//  }
//}
