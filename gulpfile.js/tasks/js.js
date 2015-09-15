var gulp        = require('gulp');
var concat      = require('gulp-concat');
var uglify      = require('gulp-uglify');
var rev         = require('gulp-rev');
var eslint      = require('gulp-eslint');
var filter      = require('gulp-filter');
var browserSync = require('browser-sync');
var browserify  = require('browserify');
var through2    = require('through2');
var compile     = require('../lib/compile.js');
var register    = require('../lib/register.js');
var coffee      = require('gulp-coffee');
var babel       = require('gulp-babel');
var path        = require('path');

var w;

function doBrowserify() {
  return through2.obj(function (file, enc, next){
    if(typeof w === 'undefined') {
      var b = browserify(file.path, {cache: {}, packageCache: {}})
      w = watchify(b);
    }
    w.bundle(function(err, res){
      // assumes file.contents is a Buffer
      file.contents = res;
      // rename to .js
      file.path = path.dirname(file.path) + "/" + path.basename(file.path, path.extname(file.path)) + '.js';
      next(null, file);
    }).on('data', function() {});
  });
}

var compileSteps = [
  {"fn": function(lazy) {return lazy.pipe(coffee);},"extensions": ["coffee"]},
  {"fn": function(lazy) {return lazy.pipe(babel);},"extensions": ["babel", "jsx", 'es6']},
  //{"fn": function(lazy) {return lazy.pipe(doBrowserify);},"extensions": ["browser", "browserify"]},
  {"fn": null,"extensions": ["js"]},
];


function development(cb, config) {
  var lintFiter = filter(config.js.lintFilters, {restore: true});
  return compile(compileSteps, config, false)
    .pipe(lintFiter)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(lintFiter.restore)
    .pipe(gulp.dest(config.dest))
    .pipe(browserSync.reload({stream:true}), cb);
}

function production(cb, config) {
  return compile(compileSteps, config, true)
    .pipe(uglify(config.js.uglify))
    .on('error', console.error.bind(console))
    .pipe(concat(config.js.concat))
    .pipe(rev())
    .pipe(gulp.dest(config.dest), cb);
}

register.environment(['js', 'javascript', 'javascripts'], development, production);
