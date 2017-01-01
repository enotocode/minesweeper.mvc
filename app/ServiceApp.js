'use strict';

var mswprGame = new MinesweeperGame();
var browserView = new BrowserView();
var browserViewController = new BrowserViewController(browserView, mswprGame);
browserView.attach(mswprGame);
browserView.render();

