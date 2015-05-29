var inherits = require('inherits');
var EventEmitter = require('events').EventEmitter;
var CellStatuses = require('./CellStatuses');
var GameStatuses = require('./GameStatuses');

module.exports = Minesweeper;
inherits(Minesweeper, EventEmitter);

var ELAPSED_TIME_INTERVAL = 1000;

function Minesweeper (board) {
  this.board = board;
  this.elapsedTime = 0;
}

Minesweeper.prototype.getRows = function () {
  return this.board.getRows();
};

Minesweeper.prototype.getRemainingFlagCount = function () {
  return this.board.getRemainingFlagCount();
};

Minesweeper.prototype.getStatus = function () {
  if (this._hasLost()) {
    return GameStatuses.LOST;
  } else if (this._hasWon()) {
    return GameStatuses.WON;
  } else {
    return GameStatuses.ACTIVE;
  }
};

Minesweeper.prototype._hasLost = function () {
  return this.board.getCells().some(function (cell) {
    return cell.status === CellStatuses.EXPLODED;
  });
};

Minesweeper.prototype._hasWon = function () {
  return this.board.getCells()
    .filter(function (cell) {
      return !cell.mine;
    })
    .every(function (cell) {
      return cell.status === CellStatuses.REVEALED;
    });
};

Minesweeper.prototype.flagCell = function (x, y) {
  this.board.at(x, y).status = CellStatuses.FLAGGED;
  this.emit('change');
  return this;
};

Minesweeper.prototype.unflagCell = function (x, y) {
  this.board.at(x, y).status = CellStatuses.NORMAL;
  this.emit('change');
  return this;
};

Minesweeper.prototype.revealCell = function (x, y) {
  if (!this.timer) {
    this.timer = setInterval(this._updateElapsedTime.bind(this), ELAPSED_TIME_INTERVAL);
  }

  var cell = this.board.at(x, y);

  if (cell.mine) {
    cell.status = CellStatuses.EXPLODED;
    this._revealMines();
  } else {
    cell.status = CellStatuses.REVEALED;

    if (cell.adjacentMineCount === 0) {
      this._revealAdjacentEmptyCells(cell);
      this._revealCellsAdjacentToEmptyRevealedCells(cell);
    }
  }

  if (this.getStatus() !== GameStatuses.ACTIVE) {
    clearInterval(this.timer);
  }

  this.emit('change');
  return this;
};

Minesweeper.prototype.getElapsedTime = function () {
  return this.elapsedTime;
};

Minesweeper.prototype._updateElapsedTime = function () {
  this.elapsedTime += ELAPSED_TIME_INTERVAL;
  this.emit('change');
};

Minesweeper.prototype._revealMines = function () {
  this.board.getCells()
    .filter(function (cell) {
      return cell.status === CellStatuses.NORMAL && cell.mine;
    })
    .forEach(function (cell) {
      cell.status = CellStatuses.REVEALED;
    });
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
