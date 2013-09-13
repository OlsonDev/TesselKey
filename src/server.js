var temp    = require('temp')
	, path    = require('path')
	, express = require('express')
	, less    = require('less-middleware')
	, root    = __dirname
	, tmp     = path.join(temp.dir, 'TesselKey')
	, views   = path.join(root    , 'views')
	, pub     = path.join(root    , 'public')
	, images  = path.join(pub     , 'images')
	, scripts = path.join(pub     , 'scripts')
	, app     = express()
	, trimmer = require('./modules/trimmer.js')
	, webp    = require('./modules/webp.js')
	, port    = process.env.PORT || 5000
;

app.disable('X-Powered-By');

app.configure(function() {
	app.use(express.compress());
	app.use(trimmer());
	app.use(webp(pub));
	app.use(express.favicon(path.join(images, 'favicon.ico')));
	app.use('/images',  express.static(images));
	app.use('/scripts', express.static(scripts));
	app.use(less({ src: pub, dest: tmp }));
	app.use(express.static(tmp));
	app.use(express.static(views));
});

app.listen(port, function() {
	console.log('Listening on port ' + port);
});