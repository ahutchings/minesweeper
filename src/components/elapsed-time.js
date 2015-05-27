var h = require('virtual-dom/h');

module.exports = render;

function render (state) {
  return h('.elapsed-time', (state.elapsedTime / 1000) + '');
}