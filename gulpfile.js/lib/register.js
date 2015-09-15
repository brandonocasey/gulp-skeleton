var gulp   = require('gulp');
var config = require('../config');
var _      = require('lodash');

module.exports = {
  environment: function(names, development, production) {
    if(!_.isArray(names)) {
      names = [names]
    }
    var _production = function(cb) {
        return production(cb, config);
    };
    var _development = function(cb) {
        return development(cb, config);
    };

    var _choice = function(cb) {
      if(process.env.NODE_ENV === "production") {
        return _production(cb)
      } else {
        return _development(cb)
      }
    };

    _.forEach(names, function(name) {
      gulp.task(name, _choice);
      gulp.task(name + ":production", _production);
      gulp.task(name + ":prod", _production);
      gulp.task(name + ":p", _production);
      gulp.task(name + ":development", _development);
      gulp.task(name + ":devel", _development);
      gulp.task(name + ":dev", _development);
      gulp.task(name + ":d", _development);
    });
  },
  single: function(names, fn) {
    if(!_.isArray(names)) {
      names = [names]
    }
    var _call = function(cb) {
      return fn(cb, config);
    };
    _.forEach(names, function(name) {
      gulp.task(name, _call);
    });
  },
}
