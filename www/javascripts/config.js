var requirejs = {
  baseUrl: 'javascripts/vendor',
  shim: {
    'underscore': { exports: '_' },
    'backbone': { deps: ['jquery', 'underscore'], exports: 'Backbone' },
    'three': { exports: 'THREE' },
    'prettify': { exports: 'prettyPrint' }
  },
  paths: {
    'main': '../main',
    'toxiclibsjs': '../toxiclibsjs',
    'toxi': '../../../../working_dir/lib/toxi' //https://raw.github.com/hapticdata/toxiclibsjs/feature_wemesh/lib/toxi'
  }
};