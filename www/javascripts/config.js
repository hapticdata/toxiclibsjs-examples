requirejs = {
  baseUrl: 'javascripts/vendor',
  shim: {
    underscore: { exports: '_' },
    backbone: { deps: ['jquery', 'underscore'], exports: 'Backbone' }
  },
  paths: {
    'toxiclibsjs': '../toxiclibsjs',
    'toxi': 'https://raw.github.com/hapticdata/toxiclibsjs/develop/lib/toxi'
  }
};