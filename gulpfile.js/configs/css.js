var folder = "/stylesheets";

var stylesheets = module.exports = {
  concat: 'assets/css/all.css',
  lintFilters: ['!*'],
  autoprefixer: {
    browsers: ['last 2 versions'],
    cascade: false,
  },
  uncss : {},
  nano  : {
    discardComments: {
      removeAll: true
    }
  },
};
