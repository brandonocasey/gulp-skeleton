var gulp = require('gulp');
var sequence = require('run-sequence');

gulp.task('default', function(cb) {
  if(process.env.NODE_ENV === "production") {
    return sequence('production', cb);
  } else {
    return sequence('development', cb);
  }
});
