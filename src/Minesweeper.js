var inherits = require('inherits');
var EventEmitter = require('events').EventEmitter;
var CellStatuses = require('./CellStatuses');

module.exports = Minesweeper;
inherits(Minesweeper, EventEmitter);

function Minesweeper (board) {
  this.board = board;
}

Minesweeper.prototype.getRows = function () {
  return this.board.getRows();
};

Minesweeper.prototype.getRemainingFlagCount = function () {
  return this.board.getRemainingFlagCount();
};

Minesweeper.prototype.flagCell = function (x, y) {
  this.board.at(x, y).status = CellStatuses.FLAGGED;
  this.emit('change');
  return this;
};

Minesweeper.prototype.revealCell = function (x, y) {
  var cell = this.board.at(x, y);
  cell.status = CellStatuses.REVEALED;

  if (!cell.bomb && cell.adjacentMineCount === 0) {
    this._revealAdjacentEmptyCells(cell);
    this._revealCellsAdjacentToEmptyRevealedCells(cell);
  }

  this.emit('change');
  return this;
};

Minesweeper.prototype._revealAdjacentEmptyCells = function (cell) {
  this._getAdjacentNormalEmptyCells(cell).forEach(function (cell) {
    cell.status = CellStatuses.REVEALED;
    this._revealAdjacentEmptyCells(cell);
  }, this);
};

Minesweeper.prototype._getAdjacentNormalEmptyCells = function (cell) {
  return this.board.getAdjacentCells(cell).filter(function (cell) {
    return cell.status === CellStatuses.NORMAL && cell.adjacentMineCount === 0;
  });
};

Minesweeper.prototype._revealCellsAdjacentToEmptyRevealedCells = function () {
  var self = this;

  this.board.getCells()
    .filter(function (cell) {
      return cell.status === CellStatuses.REVEALED && cell.adjacentMineCount === 0;
    }).forEach(function (cell) {
      self.board.getAdjacentCells(cell).forEach(function (cell) {
        cell.status = CellStatuses.REVEALED;
      });
    });
};

Minesweeper.prototype.serialize = function () {
  return JSON.stringify(this.board);
};
