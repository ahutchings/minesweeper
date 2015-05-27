var inherits = require('inherits');
var EventEmitter = require('events').EventEmitter;
var flatten = require('flatten');
var CellStatuses = require('./CellStatuses');

module.exports = Minesweeper;
inherits(Minesweeper, EventEmitter);

function Minesweeper (board) {
  this.board = board;
}

Minesweeper.prototype.getRows = function () {
  return this.board;
};

Minesweeper.prototype.getRemainingFlagCount = function () {
  return this._getMineCount() - this._getFlaggedCount();
};

Minesweeper.prototype._getFlaggedCount = function () {
  return flatten(this.board).filter(function (cell) {
    return cell.status === CellStatuses.FLAGGED;
  }).length;
};

Minesweeper.prototype._getMineCount = function () {
  return flatten(this.board).filter(function (cell) {
    return cell.mine;
  }).length;
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
