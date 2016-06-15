/// <reference path="../lib/backbone/backbone.js" />
/// <reference path="../lib/jquery/jquery-2.1.4.js" />
/// <reference path="../lib/underscore/underscore.js" />
/// <reference path="../lib/jqueryui/jquery-ui.js" />

var conf = {
  baseUrl: 'scripts/tetris',
  paths: {
    jquery: '../lib/jquery/jquery-2.1.4',
    jqueryui: '../lib/jqueryui/jquery-ui',
    underscore: '../lib/underscore/underscore',
    can: '../lib/canjs/can.custom',
    require: '../lib/require/require',
    text: '../lib/require/text',
    backbone: '../lib/backbone/backbone'
  },
  shim: {
    can: {
      deps: ['jquery'],
      exports: 'can'
    },
    underscore: {
      exports: '_'
    },
    backbone: {
      deps: ['jquery', 'underscore'],
      exports: 'Backbone'
    },
    jquery: {
      exports: '$'
    },
    jqueryui: {
      deps: ['jquery']
    }
  }
};

requirejs.config(conf);

require(['game'], function (Game) {
  var game = new Game('#content', {
    xSize: 10,
    ySize: 20
  });

  game.run();
});
