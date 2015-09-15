var gulp     = require('gulp');
var sequence = require('run-sequence');
var register = require('../lib/register');

function production(cb, config) {
  process.env.NODE_ENV = 'production';
  return sequence('build', cb);
};

register.single(['prod', 'pro', 'p', 'production'], production);
