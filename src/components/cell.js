var h = require('virtual-dom/h');
var xtend = require('xtend');
var CellStatuses = require('../CellStatuses');
var GameStatuses = require('../GameStatuses');

module.exports = render;

var CELL_SIZE = 16;

var baseStyle = {
  boxSizing: 'border-box',
  display: 'inline-block',
  lineHeight: CELL_SIZE + 'px',
  overflow: 'hidden',
  textAlign: 'center',
  height: CELL_SIZE,
  width: CELL_SIZE
};

var adjacentCountColor = {
  0 : 'transparent',
  1 : 'blue',
  2 : 'green',
  3 : 'red',
  4 : 'navy',
  5 : '#8d0000',
  6 : '#008380',
  7 : 'black',
  8 : '#808080'
};

var normalStyle = {
  backgroundColor: '#bdbdbd',
  borderColor: '#7b7b7b',
  borderTopColor: '#fff',
  borderLeftColor: '#fff',
  borderStyle: 'solid',
  borderWidth: 2
};

function render (state) {
  var isActiveGame = state.gameStatus === GameStatuses.ACTIVE;
  var cell = state.cell;
  var attributes = {};
  var style;
  var content = '';

  switch (cell.status) {
    case CellStatuses.EXPLODED:
      style = {
        backgroundColor: 'red'
      };

      content = '*';
      break;

    case CellStatuses.FLAGGED:
      style = xtend(normalStyle, {
        color: 'red'
      });

      if (isActiveGame) attributes.oncontextmenu = function (event) {
        event.preventDefault();

        state.dispatcher.dispatch({
          actionType : 'unflagCell',
          cell       : cell
        });
      };

      content = '!';
      break;

    case CellStatuses.NORMAL:
      style = normalStyle;

      if (isActiveGame) attributes.oncontextmenu = function (event) {
        event.preventDefault();

        state.dispatcher.dispatch({
          actionType : 'flagCell',
          cell       : cell
        });
      };

      if (isActiveGame) attributes.onclick = function (event) {
        state.dispatcher.dispatch({
          actionType : 'revealCell',
          cell       : cell
        });
      };

      break;

    case CellStatuses.REVEALED:
      style = {
        backgroundColor: 'silver',
        borderColor: 'grey',
        borderStyle: 'solid',
        borderBottomWidth: 1,
        borderRightWidth: 1,
        borderWidth: 0
      };

      if (cell.mine) {
        content = '*';
      } else {
        style.color = adjacentCountColor[cell.adjacentMineCount];
        content = cell.adjacentMineCount + '';
      }
  }

  attributes.style = xtend(baseStyle, style);

  return h('.cell', attributes, content);
}
