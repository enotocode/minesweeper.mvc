'use strict';

// Create game Model
var MinesweeperGame = require('./MinesweeperGame');
var mswprGame = new MinesweeperGame();

// Create browser View
var BrowserView = require('./BrowserView');
var browserView = new BrowserView(mswprGame);

// Create modal View
var ModalView = require('./ModalView');
var modalView = new ModalView();

// Create browser Controller
var BrowserViewController = require('./BrowserViewController');
var browserViewController = new BrowserViewController(browserView, mswprGame);

// Render field in browser
browserView.render();

var ModalController = require('./ModalController');
var modalViewController = new ModalController(modalView, mswprGame);
modalView.attach(mswprGame);

// Create console Controller
var ConsoleController = require('./ConsoleController');
var game = new ConsoleController();
game.attach(mswprGame);

