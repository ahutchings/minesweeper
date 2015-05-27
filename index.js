var document = require('global/document');
var mainLoop = require('main-loop');
var Dispatcher = require('flux').Dispatcher;
var BeginnerConfig = require('./src/configs/BeginnerConfig');
var BoardGenerator = require('./src/BoardGenerator');
var Minesweeper = require('./src/Minesweeper');
var render = require('./src/components/board');

var dispatcher = new Dispatcher();
var game;

dispatcher.register(function (payload) {
  switch (payload.actionType) {
    case 'flagCell':
      game.flagCell(payload.cell.x, payload.cell.y);
      break;

    case 'revealCell':
      game.revealCell(payload.cell.x, payload.cell.y);
      break;

    case 'unflagCell':
      game.unflagCell(payload.cell.x, payload.cell.y);
      break;

    case 'resetGame':
      generateGame();
      update();
      break;
  }
});

function getState () {
  return {
    dispatcher     : dispatcher,
    elapsedTime    : game.getElapsedTime(),
    gameStatus     : game.getStatus(),
    rows           : game.getRows(),
    remainingFlags : game.getRemainingFlagCount()
  };
}

function generateGame () {
  if (game) game.removeAllListeners();

  var config = new BeginnerConfig();
  var board = new BoardGenerator(config).generate();

  game = new Minesweeper(board);
  game.on('change', update);
}

function update () {
  loop.update(getState());
}

generateGame();

var loop = mainLoop(getState(), render, {
  create : require('virtual-dom/create-element'),
  diff   : require('virtual-dom/diff'),
  patch  : require('virtual-dom/patch')
});

document.getElementById('container').appendChild(loop.target);
