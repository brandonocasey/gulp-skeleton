var merge2      = require('merge2');
var _           = require('lodash');
var foreach     = require('gulp-foreach');
var pluck       = require('gulp-pluck');
var data        = require('gulp-data');
var yaml        = require('js-yaml');
var fs          = require('fs');
var path        = require('path');
var consolidate = require('gulp-consolidate');
var rename      = require('gulp-rename');
var cache       = require('gulp-cached');
var newer       = require('gulp-newer');
var fm          = require('front-matter');
var gulp        = require('gulp');

var datatypes = [
  {'fn': function(file) {return yaml.safeLoad(String(file.contents));},'search': '*.yaml'},
  {'fn': function(file) {return JSON.parse(String(file.contents));}, 'search': '*.json'},
  {'fn': function(file) {return fm(String(file.contents))}, 'search': '*.{fm,md}'}
];

// TODO: dont do include empty directories
function GetDirectories(dir, array) {
  if(typeof array === 'undefined') {
    base = '';
    array = [];
  }
  var files = fs.readdirSync(dir);
  _.forEach(files, function(file) {
    file = dir + "/" + file;
    var stats = fs.statSync(file);
    if(stats.isDirectory()) {
      array.push(file);
      GetDirectories(file, array);
    }
  })
  return array;
}

// We grab data pipes twice for every page
// Once to create singular files
// Once to create the index
module.exports = function generateStatic(config) {
  var pages = GetDirectories(config.src + "/" + config.html.static.directories.data);
  var pagePipes = _.map(pages, function(page) {
    return merge2(
      GetDataPipes(config, page)
        .pipe(foreach(function(stream, file) {
          return generate(config, file.path, file.data, file.data.layout || config.html.static.layouts.entry);
        })),
      GetDataPipes(config, page)
        // used .json, but it could be anything or blank
        .pipe(pluck('data', page + '.json'))
        .pipe(foreach(function(stream, file) {
          return generate(config, page, file.data, config.html.static.layouts.index);
        }))
    );
  });
  pagePipes.push(mainPage(config, pages))

  return merge2.apply(this, pagePipes);
}

function mainPage(config, pages) {
    var layout = config.html.static.layouts.main;
    var filepath = config.src + "/" + config.html.static.directories.layouts;
    var data = _.map(pages, function(page) {
        page = path.basename(page);
        return {
            path: '/' + page,
            name: page.toUpperCase(),
        }
    });
    return generate(config, filepath, data, layout);

}

function GetDataPipes(config, page) {
  return merge2.apply(this, _.map(datatypes, function(datatype) {
    return gulp.src(page + "/" + datatype.search)
      .pipe(data(function(file) {
        file.data = datatype.fn(file);
        file.data.category = path.basename(page);
        file.data.path = path.relative(page, file.path);
        file.data.path = path.basename(file.data.path, path.extname(file.data.path));
        file.data.path = path.join(file.data.category, file.data.path);
        file.data.path = "/" + file.data.path;
      }));
  }));
}

function generate(config, filepath, filedata, layout) {
  layout = config.src + "/" + config.html.static.directories.layouts + "/" + layout;
  return gulp.src(layout + ".*")
    .pipe(consolidate('hogan', {
      data: filedata,
      partials: { layout: config.html.static.layouts.master }
    }))
    .pipe(rename(function(layout_filepath) {
      var dirname = path.dirname(filepath);
      dirname = path.relative(config.src + "/" + config.html.static.directories.data, dirname);
      dirname = path.join(dirname, path.basename(filepath, path.extname(filepath)) );
      layout_filepath.basename = 'index';
      layout_filepath.extname  = '.html';
      layout_filepath.dirname  = dirname;
    }));
}

