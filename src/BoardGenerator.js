var CellStates = require('./CellStates');

module.exports = BoardGenerator;

function BoardGenerator (config) {
  this.config = config;
}

BoardGenerator.prototype.generate = function () {
  return this._generateRows();
};

BoardGenerator.prototype._generateRows = function () {
  var rows = [];

  for (var i = 0; i < this.config.ROWS; i++) {
    rows.push(this._generateRow());
  }

  return rows;
};

BoardGenerator.prototype._generateRow = function () {
  var row = [];

  for (var i = 0; i < this.config.COLS; i++) {
    row.push(this._generateCell());
  }

  return row;
};

BoardGenerator.prototype._generateCell = function () {
  return {
    bomb  : false,
    state : CellStates.NORMAL
  };
};
