'use strict';

function ModalController(view) {
    
    this._view = view;
    
    this._view.viewEvent.subscribe('startButtonClick', function(){
        console.log('Start');
    });    
    
}