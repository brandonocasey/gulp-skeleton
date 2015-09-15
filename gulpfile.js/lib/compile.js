var gulp       = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var lazypipe   = require('lazypipe');
var _          = require('lodash');
var merge2     = require('merge2');
var plumber    = require('gulp-plumber');
var d          = require('gulp-debug');
var gulpif     = require('gulp-if');
var cache      = require('gulp-cached');
var gutil      = require('gulp-util');
var newer      = require('gulp-newer');

var defaultfn = function(lazy) { return lazy.pipe(gutil.noop); };
module.exports = function(steps, config, production) {
  var pipes = _.map(steps, function(step) {
    var ext_str = step.extensions.join();
    var name = step.extensions[0];
    var fn = step.fn;
    if(_.isNull(fn)) {
      fn = defaultfn;
    }
    if(step.extensions.length > 1) {
      ext_str = "{" + step.extensions.join(",") + "}";
    }

    var p = lazypipe()
      .pipe(gulp.src, config.src + "/**/*." + ext_str)
      .pipe(function() {
        return gulpif(!production, newer(config.dest));
      })
      .pipe(function() {
        return gulpif(!production, cache(name));
      })
      .pipe(function() {
        return gulpif((!production && !step.noMap), sourcemaps.init());
      })
    return fn(p.pipe(plumber))
      .pipe(function() {
        return gulpif((!production && !step.noMap), sourcemaps.write());
      });
    });
    return merge2.apply(this, _.map(pipes, function(pipe) {
      return pipe();
    }));
}
