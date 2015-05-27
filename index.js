var document = require('global/document');
var mainLoop = require('main-loop');
var Dispatcher = require('flux').Dispatcher;
var BeginnerConfig = require('./src/configs/BeginnerConfig');
var BoardGenerator = require('./src/BoardGenerator');
var Minesweeper = require('./src/Minesweeper');
var render = require('./src/components/board');

var config = new BeginnerConfig();
var board = new BoardGenerator(config).generate();
var game = new Minesweeper(board);
var dispatcher = new Dispatcher();

function getState () {
  return {
    dispatcher : dispatcher,
    rows       : game.getRows()
  };
}

var loop = mainLoop(getState(), render, {
  create : require('virtual-dom/create-element'),
  diff   : require('virtual-dom/diff'),
  patch  : require('virtual-dom/patch')
});

game.on('change', function () {
  loop.update(getState());
});

document.getElementById('container').appendChild(loop.target);
