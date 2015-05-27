var Board = require('./Board');
var CellStatuses = require('./CellStatuses');

module.exports = BoardGenerator;

function BoardGenerator (config) {
  this.config = config;
}

BoardGenerator.prototype.generate = function () {
  var rows = this._generateRows();
  var board = new Board(rows);

  this._placeMines(board);
  this._setAdjacentMineCounts(board);

  return board;
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
  var cells = board.getCells();

  for (var i = 0; i < this.config.MINES; i++) {
    var index = getRandomInt(0, cells.length - 1);
    cells[index].mine = true;
    cells.splice(index, 1);
  }

  return board;
};

BoardGenerator.prototype._setAdjacentMineCounts = function (board) {
  var cells = board.getCells();

  cells.forEach(function (cell) {
    var adjacentCells = board.getAdjacentCells(cell);
    cell.adjacentMineCount = this._countMinesInCells(adjacentCells);
  }, this);

  return board;
};

BoardGenerator.prototype._countMinesInCells = function (cells) {
  return cells.filter(function (cell) {
    return cell.mine;
  }).length;
};

function getRandomInt (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
