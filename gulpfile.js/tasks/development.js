var gulp        = require('gulp');
var sequence    = require('run-sequence');
var browserSync = require('browser-sync');
var watch       = require('gulp-watch');
var plumber     = require('gulp-plumber');
var register    = require('../lib/register');
var sequence    = require('run-sequence');

function doBrowserSync(cb, config) {
  browserSync({
    port: 1337,
    ui: {
      port: 8080,
    },
    server: {
      baseDir: config.dest,
    },
  });
  return cb();
}
function doWatch(cb, config) {

  var w = config.src + "/**/**/**/**/**/*";
  watch(w, {verbose: true}, function() {
    return sequence('build');
  });
}

function development(cb, config) {
  process.env.NODE_ENV = "development";
  return sequence('build', ['watch', 'browser-sync'], cb);
}

register.single(['browser-sync'], doBrowserSync);
register.single(['w', 'watch'], doWatch);
register.single(['d', 'dev', 'devel', 'development'], development);
