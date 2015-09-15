var html = module.exports = {
  htmlmin: {
    collapseWhitespace: true,
    removeComments: true,
  },
  lintFilters: ['!*'],
  static: {
    enabled: true,
    // Not inside of the source directory
    directories: {
      data:    'data',
      layouts: 'layouts',
    },
    layouts: {
	  main:   'main',
      index:  'index',
      entry:  'entry',
      master: 'master',
    }
  }
};
