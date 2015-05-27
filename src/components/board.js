var h = require('virtual-dom/h');
var row = require('./row');
var resetButton = require('./reset-button');
var elapsedTime = require('./elapsed-time');

module.exports = render;

function render (state) {
  return h('.board', [
      resetButton(state),
      elapsedTime(state),
      h('.remaining-flags', state.remainingFlags + ''),
      h('.cells', state.rows.map(function (item) {
        return row({
          dispatcher : state.dispatcher,
          gameStatus : state.gameStatus,
          row        : item
        });
      }))
    ]
  );
}
