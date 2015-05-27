var flatten = require('flatten');
var CellStatuses = require('./CellStatuses');

module.exports = Board;

function Board (rows) {
  this.rows = rows;
}

Board.prototype.getRows = function () {
  return this.rows;
};

Board.prototype.getCells = function () {
  return flatten(this.rows);
};

Board.prototype.at = function (x, y) {
  return this.rows[y][x];
};

Board.prototype.getRemainingFlagCount = function () {
  return this._getMineCount() - this._getFlaggedCount();
};

Board.prototype._getFlaggedCount = function () {
  return this.getCells().filter(function (cell) {
    return cell.status === CellStatuses.FLAGGED;
  }).length;
};

Board.prototype._getMineCount = function () {
  return this.getCells().filter(function (cell) {
    return cell.mine;
  }).length;
};

Board.prototype.getAdjacentCells = function (cell) {
  var self = this;
  var xRange = generateAdjacentRange(cell.x, this.rows[0].length);
  var yRange = generateAdjacentRange(cell.y, this.rows.length);

  var adjacentCells = [];

  xRange.forEach(function (x) {
    yRange.forEach(function (y) {
      if (!(cell.x === x && cell.y === y)) {
        adjacentCells.push(self.at(x, y));
      }
    });
  });

  return adjacentCells;
};

function generateAdjacentRange (num, upperBound) {
  var range = [];

  if (num > 0) {
    range.push(num - 1);
  }

  range.push(num);

  if (num < upperBound - 1) {
    range.push(num + 1);
  }

  return range;
}