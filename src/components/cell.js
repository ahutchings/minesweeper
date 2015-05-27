var h = require('virtual-dom/h');
var xtend = require('xtend');
var CellStatuses = require('../CellStatuses');
var GameStatuses = require('../GameStatuses');

module.exports = render;

var layout = {
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

var normalStyle = {
  backgroundColor: 'rgb(189, 189, 189)',
  borderColor: 'rgb(123, 123, 123)',
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

  attributes.style = xtend(layout, style);

  return h('.cell', attributes, content);
}
