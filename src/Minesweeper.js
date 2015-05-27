var inherits = require('inherits');
var EventEmitter = require('events').EventEmitter;

module.exports = Minesweeper;
inherits(Minesweeper, EventEmitter);

function Minesweeper (board) {
  this.board = board;
}

Minesweeper.prototype.getRows = function () {
  return this.board;
};

Minesweeper.prototype.serialize = function () {
  return JSON.stringify(this.board);
};
