var h = require('virtual-dom/h');
var row = require('./row');

module.exports = render;

function render (state) {
  return h('.board',
    state.rows.map(function (item) {
      return row({
        dispatcher : state.dispatcher,
        row        : item
      });
    })
  );
}
