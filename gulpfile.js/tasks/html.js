var gulp        = require('gulp');
var htmlmin     = require('gulp-htmlmin');
var lint        = require('gulp-html5-lint');
var filter      = require('gulp-filter');
var browserSync = require('browser-sync');
var inject      = require('gulp-inject');
var register    = require('../lib/register');
var compile     = require('../lib/compile');
var vulcanize   = require('gulp-vulcanize');
var static      = require('../lib/static');
var path        = require('path');



var compileSteps = [
  {"fn": null, "extensions": ["html", "htm"], "noMap": true},
];

function doInject(base, dest) {
  var into = gulp.src(dest + "/**/*", {read: false});
  dest = path.relative(base, dest);
  return inject(into, {relative: true, quiet: true});
}

function getMode(config, production) {
  if(config.html.static.enabled) {
      return static(config)
  } else {
    return compile(compileSteps, config, production);
  }
}

// TODO: do injection into layouts before they are passed along
// so that we don't inject into every file seprately
function development(cb, config) {
  var lintFilter = filter(config.html.lintFilters, {restore: true});
  return getMode(config, false)
    .pipe(gulp.dest(config.dest))
    .pipe(doInject(config.base, config.dest))
    .pipe(lintFilter)
    .pipe(lint())
    .pipe(lintFilter.restore)
    .pipe(gulp.dest(config.dest))
    .pipe(browserSync.reload({stream:true}), cb);
}

function production(cb, config) {
  return getMode(config, true)
    .pipe(gulp.dest(config.dest))
    .pipe(doInject(config.base, config.dest))
    .pipe(htmlmin(config.html.htmlmin))
    .pipe(gulp.dest(config.dest))
    .pipe(vulcanize({
      inlineScripts: true,
      inlineCss: true,
    }))
    .pipe(gulp.dest(config.dest));
}



register.environment(['views', 'layouts', 'layout', 'view', 'html', 'data', 'static'], development, production);
