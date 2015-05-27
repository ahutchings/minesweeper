var inherits = require('inherits');
var EventEmitter = require('events').EventEmitter;
var CellStatuses = require('./CellStatuses');

module.exports = Minesweeper;
inherits(Minesweeper, EventEmitter);

function Minesweeper (board) {
  this.board = board;
}

Minesweeper.prototype.getRows = function () {
  return this.board;
};

Minesweeper.prototype.flagCell = function (x, y) {
  this.board[y][x].status = CellStatuses.FLAGGED;
  this.emit('change');
  return this;
};

Minesweeper.prototype.revealCell = function (x, y) {
  this.board[y][x].status = CellStatuses.REVEALED;
  this.emit('change');
  return this;
};

Minesweeper.prototype.serialize = function () {
  return JSON.stringify(this.board);
};
