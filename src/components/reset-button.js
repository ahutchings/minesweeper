var h = require('virtual-dom/h');
var GameStatuses = require('../GameStatuses');

module.exports = render;

var contentByGameStatus = {};

contentByGameStatus[GameStatuses.WON] = 'B-)';
contentByGameStatus[GameStatuses.LOST] = ':(';
contentByGameStatus[GameStatuses.ACTIVE] = ':)';

function render (state) {
  var attributes = {
    onclick: function (event) {
      state.dispatcher.dispatch({
        actionType: 'resetGame'
      });
    }
  };

  return h('button.reset', attributes, contentByGameStatus[state.gameStatus]);
}
