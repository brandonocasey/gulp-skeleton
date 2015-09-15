var register    = require('../lib/register');
var sequence    = require('run-sequence');

function production(cb, config) {
  process.env.NODE_ENV = "production";
  return sequence('clean', ['js', 'css', 'img'], 'html', 'uncss', cb);
}

function development(cb, config) {
  process.env.NODE_ENV = "development";
  return sequence(['js', 'css', 'img'], 'html', 'uncss', cb);
}


register.environment(['build', 'b', 'bld'], development, production);
