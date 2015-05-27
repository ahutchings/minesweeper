var h = require('virtual-dom/h');
var row = require('./row');
var resetButton = require('./reset-button');

module.exports = render;

function render (state) {
  return h('.board', [
      resetButton(state),
      h('.remaining-flags', state.remainingFlags + ''),
      h('.cells', state.rows.map(function (item) {
        return row({
          dispatcher : state.dispatcher,
          row        : item
        });
      }))
    ]
  );
}
