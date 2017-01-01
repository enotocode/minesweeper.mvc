'use strict';

function ModalView(container) {
    this._container = container;
    this._elements = {};
    this.viewEvent = new GameEvent();   
}

ModalView.prototype.render = function() {
    
    var template = document.getElementById('modal-template');
    var content = template.innerHTML;
      
    var div = document.createElement('div');
    div.className = "modal";    
    div.innerHTML = content;
    div.id = 'modal';
    
    this._container.appendChild(div);

    this._elements.startButton = document.getElementById('start-button');
    var _this = this;
    
    this._elements.startButton.onclick = function() {
        console.log("text");
        _this.viewEvent.dispatchEvent('startButtonClick', null);
    };

}

