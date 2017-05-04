'use strict';

var MinesweeperGame = require('./MinesweeperGame');
var mswprGame = new MinesweeperGame();

var BrowserView = require('./BrowserView');
var browserView = new BrowserView(mswprGame);

var BrowserViewController = require('./BrowserViewController');
var browserViewController = new BrowserViewController(browserView, mswprGame);

browserView.render();

// Exec modal view
var ModalView = require('./ModalView');
var modalView = new ModalView();

var ModalController = require('./ModalController');
var modalViewController = new ModalController(modalView, mswprGame);
modalView.attach(mswprGame);

// Console controller
var ConsoleController = require('./ConsoleController');
var game = new ConsoleController();
game.attach(mswprGame);

