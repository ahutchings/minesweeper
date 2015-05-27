var CellStatuses = require('./CellStatuses');

module.exports = BoardGenerator;

function BoardGenerator (config) {
  this.config = config;
}

BoardGenerator.prototype.generate = function () {
  return this._generateRows();
};

BoardGenerator.prototype._generateRows = function () {
  var rows = [];

  for (var y = 1; y <= this.config.ROWS; y++) {
    rows.push(this._generateRow(y));
  }

  return rows;
};

BoardGenerator.prototype._generateRow = function (y) {
  var row = [];

  for (var x = 1; x <= this.config.COLS; x++) {
    row.push(this._generateCell(x, y));
  }

  return row;
};

BoardGenerator.prototype._generateCell = function (x, y) {
  return {
    bomb   : false,
    status : CellStatuses.NORMAL,
    x      : x,
    y      : y
  };
};
