'use strict';

/**
 * Modal view
 * @property {DOMElement} _modalWindow - Modal window
 * @property {eventDispatcher} eventDispatcher - Object of EventDispatcher
 */
function ModalView() {

    this._modalWindow = undefined;
    this.eventDispatcher = new EventDispatcher();
    
}

/**
 * Attaching model and subscribing for events
 * @param   {MinesweeperGame} model The game model
 */
ModalView.prototype.attach = function(model) {
    
    this._model = model;
    var that = this;
    
    this._model.eventDispatcher.subscribe( GameEvent.GAME_OVER, function() {
        that.render();
    });
}

/**
 * Render modal window
 */
ModalView.prototype.render = function() {

    var modalWindow = this.createWindow();    
    var button = this.createButtons();
    
    modalWindow.appendChild(button);    
   
    this.insertElement(modalWindow);
    
    this._modalWindow = modalWindow;
   
}

ModalView.prototype.createWindow = function() {
    
    var window = document.createElement('div');
    
    window.className = "modal";
    window.id = 'modal';
    window.innerHTML = 'Начать новую игру';
    
    return window;    
}

/**
 * Generate control button
 */
ModalView.prototype.createButtons = function() {
    
    var button = document.createElement('button');
    
    button.type = 'button';    
    button.id = 'modal-new-game';
    button.class = 'button controll';
    button.innerHTML = 'New Game';
    
    var that = this;
    
    button.onclick = function(event){
        
        var target = event.target;
        that.eventDispatcher.dispatchEvent( new GameEvent(GameEvent.RESTART, target) );
        
        // Delete itself from DOM
        var body = document.getElementsByTagName('body')[0];
        body.removeChild(that._modalWindow);
        
    };
    
    return button;
};

/**
 * Injection element in DOM
 * @argument {DONElement} element 
 */
ModalView.prototype.insertElement = function (element) {
    var parentElement = document.getElementsByTagName('body')[0];
    console.log(parentElement);
    parentElement.appendChild(element);
};
