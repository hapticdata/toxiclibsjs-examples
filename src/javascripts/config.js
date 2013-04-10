/*global requirejs: false*/
requirejs.config({
  shim: {
    'underscore': { exports: '_' },
    'backbone': { deps: ['jquery', 'underscore'], exports: 'Backbone' },
    'three': { exports: 'THREE' },
    'prettify': { exports: 'prettyPrint' }
  },
  paths: {
    'templates': '../../views',
    'common': '../common',
    'main': '../main',
    'site': '../site',
    'toxi': 'https://raw.github.com/hapticdata/toxiclibsjs/develop/lib/toxi'
  }
});