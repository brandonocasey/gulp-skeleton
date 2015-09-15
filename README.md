# Steps
eslint --init

# Caveats
* all lint filters will be done after preprocessing, EX: thing.styl will be thing.css
* path/category should not be used in your data files

# Features
## General
* extensible preprocessor compilation support
* in memory development cache
* custom tasks via environment
* static website generation from data files
* sane defaults for configuration
* browsersync + source map integration for dev mode
* Blazingly fast re-builds
* extensive configuration, without needless configuration

## CSS
* uncss, remove unused css
* compile fonts into a font face definition, then include that
* inject all css into the page
* Vulcanize css into the html in production
* sourcemaps in development mode
* lint with filter so that you will only lint what you wrote
* autoprefixer
* cache busted
* minified with cssnano
* out of the box support for css, less, scss, and stylus
* concat in production

## JS
* uglify in production
* cache bust
* sourcemaps in development mode
* linting in development mode with a filter
* support for babel, jsx, and browserify processing out of the box
* inject all files into html
* concat in production

## IMG
* imagemin support

## HTML
* static file generation into html
* default to hogan.js for templates
* lint html in dev mode
* minify in production
* vulcanize in production

## Static
* can load json, yaml, or fm files, and easily support more
* can validate against a schema (or not)
