/*global requirejs: false*/
requirejs.config({
  shim: {
    'underscore': { exports: '_' },
    'backbone': { deps: ['jquery', 'underscore'], exports: 'Backbone' },
    'three': { exports: 'THREE' },
    'prettify': { exports: 'prettyPrint' },
    'd3': { exports: 'd3' }
  },
  paths: {
    'templates': '../../views',
    'examples': '../examples',
    'extras': '../extras',
    'common': '../common',
    'main': '../main',
    'site': '../site',
    'site/map': '../../site',
    'toxi': '../../toxiclibsjs/lib/toxi'//'http://raw.github.com/hapticdata/toxiclibsjs/feature-color/lib/toxi'
  }
});
