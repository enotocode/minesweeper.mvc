'use strict';

var mswprGame = new MinesweeperGame();
var browserView = new BrowserView();
var browserViewController = new BrowserViewController(browserView, mswprGame);
browserView.attach(mswprGame);
browserView.render();

// Exec modal view
var modalView = new ModalView();
var modalViewController = new ModalController(modalView, mswprGame);
modalView.attach(mswprGame);

// Console controller
var game = new ConsoleController();
game.attach(mswprGame);

