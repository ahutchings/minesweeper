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

var statusStyles = {};

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

statusStyles[CellStatuses.FLAGGED] = statusStyles[CellStatuses.NORMAL];


function render (state) {
  var attributes = {
    style: xtend(statusStyles[state.cell.status], baseStyle),
    oncontextmenu: function (event) {
      event.preventDefault();
      event.stopPropagation();

      state.dispatcher.dispatch({
        actionType : 'flagCell',
        cell       : state.cell
      });
    },
    onclick: function (event) {
      state.dispatcher.dispatch({
        actionType : 'revealCell',
        cell       : state.cell
      });
    }
  };

  return h('.cell', attributes, renderContent(state.cell));
}

function renderContent (cell) {
  switch (cell.status) {
    case CellStatuses.NORMAL:
      return '';
    case CellStatuses.FLAGGED:
      return '!';
    case CellStatuses.REVEALED:
      return cell.bomb ? '*' : '';
  }
}
