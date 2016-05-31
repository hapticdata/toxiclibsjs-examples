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
    'd3': 'vendor/d3',
    'dat': 'vendor/dat',
    'jquery': 'vendor/jquery',
    'underscore': 'vendor/underscore',
    'backbone': 'vendor/backbone',
    'prettify': 'vendor/prettify',
    'jade': 'vendor/jade',
    'templates': '../views',
    'text': 'vendor/text',
    'three': 'vendor/three',
    'toxi': 'http://s3.amazonaws.com/toxiclibsjs/toxiclibsjs/lib/toxi'//'../toxiclibsjs'
  }
});
