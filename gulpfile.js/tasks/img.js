var gulp        = require('gulp');
var imagemin    = require('gulp-imagemin');
var cache       = require('gulp-cached');
var browserSync = require('browser-sync');
var plumber     = require('gulp-plumber');
var register    = require('../lib/register');

function development(cb, config) {
  return gulp.src(config.src + "/**/*.{png,gif,jpg,jpeg,svg}")
    .pipe(plumber())
    .pipe(cache('img'))
    .pipe(gulp.dest(config.dest))
    .pipe(browserSync.reload({stream:true}), cb);
}
function production(cb, config) {

  return gulp.src(config.src + "/**/*.{png,gif,jpg,jpeg,svg}")
    .pipe(plumber())
    .pipe(imagemin(config.img.imagemin))
    .pipe(gulp.dest(config.dest), cb);
}

register.environment(['images', 'img', 'image'], development, production);
