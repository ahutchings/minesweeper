var h = require('virtual-dom/h');
var xtend = require('xtend');
var CellStatuses = require('../CellStatuses');

module.exports = render;

var baseStyle = {
  boxSizing: 'border-box',
  display: 'inline-block',
  height: 16,
  width: 16
};

var adjacentCountColor = {
  0 : 'transparent',
  1 : 'blue',
  2 : 'green',
  3 : 'red',
  4 : 'navy'
};

var statusStyles = {};

statusStyles[CellStatuses.EXPLODED] = {
  color: 'red'
};

statusStyles[CellStatuses.REVEALED] = {
  backgroundColor: 'silver',
  borderColor: 'grey',
  borderStyle: 'solid',
  borderBottomWidth: 1,
  borderRightWidth: 1,
  borderWidth: 0
};

statusStyles[CellStatuses.NORMAL] = {
  backgroundColor: 'rgb(189, 189, 189)',
  borderColor: 'rgb(123, 123, 123)',
  borderTopColor: '#fff',
  borderLeftColor: '#fff',
  borderStyle: 'solid',
  borderWidth: 2
};

statusStyles[CellStatuses.FLAGGED] = xtend(statusStyles[CellStatuses.NORMAL], {
  color: 'red'
});


function render (state) {
  var cell = state.cell;
  var style = xtend(statusStyles[cell.status], baseStyle);

  if (state.cell.status === CellStatuses.REVEALED && !cell.mine) {
    style.color = adjacentCountColor[cell.adjacentMineCount];
  }

  var attributes = {
    style: style,
    oncontextmenu: function (event) {
      event.preventDefault();

      state.dispatcher.dispatch({
        actionType : 'flagCell',
        cell       : cell
      });
    },
    onclick: function (event) {
      state.dispatcher.dispatch({
        actionType : 'revealCell',
        cell       : cell
      });
    }
  };

  return h('.cell', attributes, renderContent(cell));
}

function renderContent (cell) {
  switch (cell.status) {
    case CellStatuses.NORMAL:
      return '';
    case CellStatuses.FLAGGED:
      return '!';
    case CellStatuses.EXPLODED:
    case CellStatuses.REVEALED:
      return cell.mine ? '*' : cell.adjacentMineCount + '';
  }
}
