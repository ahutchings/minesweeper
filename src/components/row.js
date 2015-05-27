var h = require('virtual-dom/h');
var cell = require('./cell');

module.exports = render;

function render (state) {
  return h('.row',
    state.row.map(function (item) {
      return cell({
        dispatcher : state.dispatcher,
        gameStatus : state.gameStatus,
        cell       : item
      });
    })
  );
}
