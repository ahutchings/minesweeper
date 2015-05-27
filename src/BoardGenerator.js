var flatten = require('flatten');
var CellStatuses = require('./CellStatuses');

module.exports = BoardGenerator;

function BoardGenerator (config) {
  this.config = config;
}

BoardGenerator.prototype.generate = function () {
  return this._setAdjacentMineCounts(this._placeMines(this._generateRows()));
};

BoardGenerator.prototype._generateRows = function () {
  var rows = [];

  for (var y = 0; y < this.config.ROWS; y++) {
    rows.push(this._generateRow(y));
  }

  return rows;
};

BoardGenerator.prototype._generateRow = function (y) {
  var row = [];

  for (var x = 0; x < this.config.COLS; x++) {
    row.push(this._generateCell(x, y));
  }

  return row;
};

BoardGenerator.prototype._generateCell = function (x, y) {
  return {
    mine   : false,
    status : CellStatuses.NORMAL,
    x      : x,
    y      : y
  };
};

BoardGenerator.prototype._placeMines = function (board) {
  var cells = flatten(board);

  for (var i = 0; i < this.config.MINES; i++) {
    var index = getRandomInt(0, cells.length - 1);
    cells[index].mine = true;
    cells.splice(index, 1);
  }

  return board;
};

BoardGenerator.prototype._setAdjacentMineCounts = function (board) {
  var cells = flatten(board);

  cells.forEach(function (cell) {
    this._setAdjacentMineCount(board, cell);
  }, this);

  return board;
};

BoardGenerator.prototype._setAdjacentMineCount = function (board, cell) {
  var adjacentCells = this._getAdjacentCells(board, cell);
  cell.adjacentMineCount = this._countMinesInCells(adjacentCells);
  return cell;
};

BoardGenerator.prototype._getAdjacentCells = function (board, cell) {
  var xRange = generateAdjacentRange(cell.x, this.config.COLS);
  var yRange = generateAdjacentRange(cell.y, this.config.ROWS);

  var adjacentCells = [];

  xRange.forEach(function (x) {
    yRange.forEach(function (y) {
      if (!(cell.x === x && cell.y === y)) {
        adjacentCells.push(board[y][x]);
      }
    });
  });

  if (adjacentCells.some(function (cell) { return !cell; })) {
    debugger;
  }

  return adjacentCells;
};

BoardGenerator.prototype._countMinesInCells = function (cells) {
  return cells.filter(function (cell) {
    return cell.mine;
  }).length;
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

function getRandomInt (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
