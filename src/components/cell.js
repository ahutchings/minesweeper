var h = require('virtual-dom/h');
var CellStates = require('../CellStates');

module.exports = render;

function render (state) {
  var attributes = {
    style: {
      backgroundColor: 'rgb(189, 189, 189)',
      borderColor: 'rgb(123, 123, 123)',
      borderTopColor: '#fff',
      borderLeftColor: '#fff',
      borderStyle: 'solid',
      borderWidth: 2,
      display: 'inline-block',
      height: 12,
      width: 12
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
  switch (cell.state) {
    case CellStates.NORMAL:
      return '';
    case CellStates.FLAGGED:
      return '!';
    case CellStates.REVEALED:
      return cell.bomb ? '*' : '';
  }
}
