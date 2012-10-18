var requirejs = {
  baseUrl: 'javascripts/vendor',
  shim: {
    underscore: { exports: '_' },
    backbone: { deps: ['jquery', 'underscore'], exports: 'Backbone' },
    three: { exports: 'THREE' }
  },
  paths: {
    'toxiclibsjs': '../toxiclibsjs',
    'toxi': '../../../../working_dir/lib/toxi' //https://raw.github.com/hapticdata/toxiclibsjs/feature_wemesh/lib/toxi'
  }
};