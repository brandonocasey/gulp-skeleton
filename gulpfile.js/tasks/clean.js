var del      = require('del');
var register = require('../lib/register');
var _        = require('lodash');

register.single('clean', function(cb, config) {
  var files = [config.dest];
  if(!_.isEmpty(config.clean)) {
    files = _.merge(files, config.clean)
  }
  return del(files, {force: true}, cb);
});
