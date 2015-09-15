var gulp         = require('gulp');
var concat       = require('gulp-concat');
var uncss        = require('gulp-uncss');
var nano         = require('gulp-cssnano');
var rev          = require('gulp-rev');
var csslint      = require('gulp-csslint');
var browserSync  = require('browser-sync');
var autoprefixer = require('gulp-autoprefixer');
var filter       = require('gulp-filter');
var register     = require('../lib/register');
var compile      = require('../lib/compile');
var stylus       = require('gulp-stylus');
var sass         = require('gulp-sass');
var less         = require('gulp-less');
var fontmin      = require('gulp-fontmin')
var rename       = require('gulp-rename');
var replace      = require('gulp-replace');
var _            = require('lodash');
var cache        = require('gulp-cached');


function fonts(lazy) {
  var fnt = filter('**/*.{woff,eot,ttf,otf,svg}', {restore: true, passthrough: true});
  var css = filter(['**/*.css']);
  return lazy
    .pipe(fontmin)
    .pipe(function() {
      return fnt;
    })
    .pipe(gulp.dest, 'out')
    .pipe(function() {
      return fnt.restore;
    })
    .pipe(function() {
      return css;
    })
    .pipe(function() {
      return rename(function(filepath) {
        filepath.dirname = filepath.dirname.replace('fonts', 'css');
        filepath.basename = '00-' + filepath.basename;
      })
    })
    .pipe(replace, /url\(\"/g, 'url("../fonts/');
}
var compileSteps = [{
    "fn": function(lazy) {return lazy.pipe(stylus);},
    "extensions": ["styl", "stylus"]
  }, {
    "fn": function(lazy) {return lazy.pipe(less);},
    "extensions": ["less"]
  }, {
    "fn": function(lazy) {return lazy.pipe(sass);},
    "extensions": ["sass", "scss"]
  }, {
    "fn": fonts,
    "noMap": true,
    "extensions": ["woff", "eot", "ttf", 'otf']
  }, {
    "fn": null,
    "noMap": true,
    "extensions": ["css"]
}];


function fixConfig(config) {
  config.css.uncss.html = _.map(config.css.uncss.html, function(search) {
    console.log(config.src + "/" + search);
    return config.src + "/" + search;
  });
  return config;
}
function production(cb, config) {
  return compile(compileSteps, config, true)
    .pipe(autoprefixer(config.css.autoprefixer))
    .pipe(nano(config.css.nano))
    .pipe(concat(config.css.concat))
    .pipe(rev())
    .pipe(gulp.dest(config.dest), cb)
}

function development(cb, config) {
  var lintFilter = filter(config.css.lintFilters, {restore: true});
  return compile(compileSteps, config, false)
    .pipe(lintFilter)
    .pipe(csslint())
    .pipe(csslint.reporter(function(file) {
      gutil.log(file.csslint.errorCount + ' errors in '+ file.path);
      file.csslint.results.forEach(function(result) {
        gutil.log(result.error.message + ' on line ' + result.error.line);
      });
    }))
    .pipe(lintFilter.restore)
    .pipe(autoprefixer(config.css.autoprefixer))
    .pipe(gulp.dest(config.dest))
    .pipe(browserSync.reload({stream:true}), cb);
}

// TODO: if html has changed clear cache
function doUncss(cb, config) {
  var uncssConfig = _.merge(config.css.uncss, {html: [config.dest + "**/*.html"]});
  return gulp.src(config.dest + '/**/*.css')
    .pipe(cache('uncss'))
    .pipe(uncss(uncssConfig))
    .pipe(gulp.dest(config.dest));
}

register.environment(['css', 'styles', 'stylesheet', 'stylesheets'], development, production)
register.single('uncss', doUncss);
