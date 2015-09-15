# Current
* gulp new `templateName`
	* template for data entries, created by user?
* gulp gen `yaml,json,fm file`
	* generate joi schema based on completed entries
	* joi-machine
* gulp validate
	* validate all static files against schemas
* inject static data into index as script variable (for search)
* dynamic thumbs with image resizer for gulp
* configurable (non-automatic) 'pages' for static website
* verify layout existance

# Low
* watchify/broken browserify
* bower/nodejs injections?

# Really low/Research, do when/as needed
* maximum concurrency in static
* maximum concurrency in compile
* do we need: temporary storage to complete rebuilds quicker?
* deploy
* test + code coverage
* localization?
* mobile build with cordova?
* server daemon + browserSync Proxy?
* documentation generation
* non-gulp plugins for transpilers
* custom injections (to make certain js/css page specific)
* do we need: use something to cache static pages, (make generation quicker)
* broken link checker
* better schema than joi?
