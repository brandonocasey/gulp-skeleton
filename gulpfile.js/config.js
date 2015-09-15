var requireDir = require('require-dir');
var _          = require('lodash');
var path       = require('path');
var configs    = requireDir('./configs');

var base = path.join(__dirname, '..');
var config = {
  'base'   : base,
  'temp'   : base + '/.temp',
  'src'    : base + '/src',
  'dest'   : base + '/out',
  'verbose': false,
}

module.exports = _.merge(config, configs);
