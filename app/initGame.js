'use strict';

// Dependencies
var MinesweeperGame = require('./MinesweeperGame');
var BrowserView = require('./BrowserView');
var BrowserViewController = require('./BrowserViewController');
var ConsoleController = require('./ConsoleController');

// Create game Model
var mswprGame = new MinesweeperGame();

// Create browser View
var browserView = new BrowserView(mswprGame);

// Create browser Controller
var browserViewController = new BrowserViewController(browserView, mswprGame);

// Render field in browser
browserView.render();

// Create console Controller
var game = new ConsoleController(mswprGame);

// Export ConsoleController for browser console access
module.exports = game;